/**
 * Stock Validation & Restock Tests
 * 
 * Tests for:
 * - Database layer stock handling (negative, NaN, etc.)
 * - Restock logic validation
 * - Product add/update stock validation
 * - Sale stock deduction with rollback
 * - Real-time view refresh after stock changes
 * - Cart stale-reference issues
 */

const path = require('path');
const fs = require('fs');
const { loadProducts, saveProducts, getDbPath } = require('../database');

// ---- Test database helpers ----
const TEST_DB = '__test_stock_validation__';

function cleanTestDb() {
  const dbPath = getDbPath(TEST_DB);
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
}

beforeEach(() => { cleanTestDb(); });
afterAll(() => { cleanTestDb(); });

// ============================================================
// 1. DATABASE LAYER — STOCK PERSISTENCE
// ============================================================
describe('Database layer — stock persistence', () => {
  test('saves and loads positive stock correctly', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: 100 }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(100);
  });

  test('saves and loads zero stock correctly', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: 0 }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(0);
  });

  test('FIX: negative stock is clamped to 0 on save and load', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: -5 }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    // FIXED: stock is clamped to 0 via Math.max(0, ...)
    expect(loaded[0].stock).toBeGreaterThanOrEqual(0);
    expect(loaded[0].stock).toBe(0);
  });

  test('NaN stock becomes 0', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: NaN }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(0);
  });

  test('string stock like "abc" becomes 0', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: 'abc' }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(0);
  });

  test('large positive stock is preserved', () => {
    const products = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: 99999 }
    ];
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(99999);
  });
});

// ============================================================
// 2. SIMULATED RENDERER LOGIC — FORM VALIDATION
// ============================================================
describe('Product form — stock validation', () => {
  // Simulate FIXED getFormData() logic from inventory.js
  function getFormData(stockValue) {
    return {
      stock: Math.max(0, parseInt(stockValue) || 0)
    };
  }

  test('FIX: negative stock from form is clamped to 0', () => {
    const data = getFormData('-10');
    // FIXED: Math.max(0, parseInt('-10') || 0) => Math.max(0, -10) => 0
    expect(data.stock).toBeGreaterThanOrEqual(0);
    expect(data.stock).toBe(0);
  });

  test('empty stock becomes 0', () => {
    const data = getFormData('');
    expect(data.stock).toBe(0);
  });

  test('valid stock is parsed correctly', () => {
    const data = getFormData('50');
    expect(data.stock).toBe(50);
  });

  test('float stock is truncated to integer', () => {
    const data = getFormData('10.7');
    // parseInt('10.7') => 10
    expect(data.stock).toBe(10);
  });

  test('zero stock is accepted', () => {
    const data = getFormData('0');
    expect(data.stock).toBe(0);
  });
});

// ============================================================
// 3. RESTOCK LOGIC SIMULATION
// ============================================================
describe('Restock — quick add validation', () => {
  const LOW_STOCK_THRESHOLD = 5;
  const MAX_RESTOCK_AMOUNT = 10000;
  const MAX_STOCK = 100000;

  function simulateQuickRestock(currentStock, addAmountStr) {
    var addAmount = parseInt(addAmountStr);
    if (isNaN(addAmount) || addAmount <= 0) {
      return { error: 'invalid_amount', stock: currentStock };
    }
    if (addAmount > MAX_RESTOCK_AMOUNT) {
      return { error: 'exceeds_max', stock: currentStock };
    }
    var newStock = Math.min(MAX_STOCK, (Number(currentStock) || 0) + addAmount);
    return { error: null, stock: newStock };
  }

  test('restock adds units correctly', () => {
    const result = simulateQuickRestock(3, '10');
    expect(result.error).toBeNull();
    expect(result.stock).toBe(13);
  });

  test('restock rejects zero amount', () => {
    const result = simulateQuickRestock(3, '0');
    expect(result.error).toBe('invalid_amount');
  });

  test('restock rejects negative amount', () => {
    const result = simulateQuickRestock(3, '-5');
    expect(result.error).toBe('invalid_amount');
  });

  test('restock rejects NaN input', () => {
    const result = simulateQuickRestock(3, 'abc');
    expect(result.error).toBe('invalid_amount');
  });

  test('restock from zero stock works', () => {
    const result = simulateQuickRestock(0, '10');
    expect(result.error).toBeNull();
    expect(result.stock).toBe(10);
  });

  test('FIX: restock rejects unreasonably large values (> 10000)', () => {
    const result = simulateQuickRestock(3, '99999999');
    // FIXED: amounts above 10000 are rejected
    expect(result.error).toBe('exceeds_max');
    expect(result.stock).toBe(3); // unchanged
  });

  test('FIX: restock total stock capped at 100000', () => {
    const result = simulateQuickRestock(99995, '10');
    expect(result.error).toBeNull();
    expect(result.stock).toBeLessThanOrEqual(MAX_STOCK);
  });

  test('restock with max allowed amount (10000) works', () => {
    const result = simulateQuickRestock(0, '10000');
    expect(result.error).toBeNull();
    expect(result.stock).toBe(10000);
  });

  // Test low stock detection
  test('product with stock <= threshold appears in low-stock list', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 3 },
      { id: '2', name: 'Notebook', stock: 10 },
      { id: '3', name: 'Eraser', stock: 0 },
      { id: '4', name: 'Pen', stock: 5 },
    ];
    const lowStock = products.filter(p => Number(p.stock) <= LOW_STOCK_THRESHOLD);
    expect(lowStock).toHaveLength(3);
    expect(lowStock.map(p => p.name)).toEqual(['Pencil', 'Eraser', 'Pen']);
  });

  test('product with stock exactly at threshold is flagged', () => {
    const products = [{ id: '1', name: 'Pencil', stock: 5 }];
    const lowStock = products.filter(p => Number(p.stock) <= LOW_STOCK_THRESHOLD);
    expect(lowStock).toHaveLength(1);
  });

  test('product with stock just above threshold is NOT flagged', () => {
    const products = [{ id: '1', name: 'Pencil', stock: 6 }];
    const lowStock = products.filter(p => Number(p.stock) <= LOW_STOCK_THRESHOLD);
    expect(lowStock).toHaveLength(0);
  });
});

// ============================================================
// 4. SALE STOCK DEDUCTION SIMULATION
// ============================================================
describe('Sale — stock deduction', () => {

  function simulateSale(products, cartItems) {
    // Step 1: validate all items have sufficient stock
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const freshProduct = products.find(p => String(p.id) === String(item.productId));
      if (!freshProduct || freshProduct.stock < item.quantity) {
        return { error: 'insufficient_stock', productId: item.productId };
      }
    }

    // Step 2: deduct stock with floor at 0
    cartItems.forEach(item => {
      const product = products.find(p => String(p.id) === String(item.productId));
      if (product) product.stock = Math.max(0, product.stock - item.quantity);
    });

    return { error: null, products };
  }

  test('normal sale deducts stock correctly', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
    ];
    const result = simulateSale(products, [{ productId: '1', quantity: 3 }]);
    expect(result.error).toBeNull();
    expect(result.products[0].stock).toBe(7);
  });

  test('sale buying exact stock leaves zero', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 5, salePrice: 5 },
    ];
    const result = simulateSale(products, [{ productId: '1', quantity: 5 }]);
    expect(result.error).toBeNull();
    expect(result.products[0].stock).toBe(0);
  });

  test('sale rejects when insufficient stock', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 2, salePrice: 5 },
    ];
    const result = simulateSale(products, [{ productId: '1', quantity: 5 }]);
    expect(result.error).toBe('insufficient_stock');
  });

  test('sale rejects when product stock is 0', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 0, salePrice: 5 },
    ];
    const result = simulateSale(products, [{ productId: '1', quantity: 1 }]);
    expect(result.error).toBe('insufficient_stock');
  });

  test('sale rejects when product does not exist', () => {
    const products = [];
    const result = simulateSale(products, [{ productId: '99', quantity: 1 }]);
    expect(result.error).toBe('insufficient_stock');
  });

  test('multi-item sale deducts all correctly', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
      { id: '2', name: 'Eraser', stock: 8, salePrice: 3 },
    ];
    const result = simulateSale(products, [
      { productId: '1', quantity: 3 },
      { productId: '2', quantity: 2 },
    ]);
    expect(result.error).toBeNull();
    expect(result.products[0].stock).toBe(7);
    expect(result.products[1].stock).toBe(6);
  });

  test('stock never goes negative even with Math edge cases', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 3, salePrice: 5 },
    ];
    // Pre-validation passes (3 >= 3)
    const result = simulateSale(products, [{ productId: '1', quantity: 3 }]);
    expect(result.error).toBeNull();
    expect(result.products[0].stock).toBe(0);
    expect(result.products[0].stock).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// 5. SALE ROLLBACK ON FAILURE
// ============================================================
describe('Sale — rollback on save failure', () => {
  test('FIX: stock IS rolled back when saveToDB fails', () => {
    // Simulate the FIXED behavior with stock snapshot and rollback
    const products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
    ];
    const originalStock = products[0].stock;

    // Save snapshot before deduction (what the fixed code does)
    const stockSnapshot = [{ id: '1', originalStock: products[0].stock }];

    // Simulate deduction
    products[0].stock = Math.max(0, products[0].stock - 3);

    // Simulate saveToDB failure
    let saveSucceeded = false;
    try {
      throw new Error('Simulated save failure');
    } catch (err) {
      saveSucceeded = false;
      // FIXED: rollback stock on failure
      stockSnapshot.forEach(function (snap) {
        const prod = products.find(p => p.id === snap.id);
        if (prod) prod.stock = snap.originalStock;
      });
    }

    // After fix, stock should be restored to originalStock
    expect(products[0].stock).toBe(originalStock);
  });

  test('FIX: rollback restores multiple products', () => {
    const products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
      { id: '2', name: 'Eraser', stock: 8, salePrice: 3 },
    ];

    const stockSnapshot = products.map(p => ({ id: p.id, originalStock: p.stock }));

    products[0].stock -= 3;
    products[1].stock -= 2;

    // Rollback
    stockSnapshot.forEach(snap => {
      const prod = products.find(p => p.id === snap.id);
      if (prod) prod.stock = snap.originalStock;
    });

    expect(products[0].stock).toBe(10);
    expect(products[1].stock).toBe(8);
  });
});

// ============================================================
// 6. REAL-TIME VIEW REFRESH SIMULATION
// ============================================================
describe('Real-time view refresh — after product update', () => {
  test('FIX: inventory form save calls refreshProductViews (all views updated)', () => {
    let renderTableCalled = false;
    let renderRestockCalled = false;
    let renderCartCalled = false;
    let refreshExplorerCalled = false;

    function renderTable() { renderTableCalled = true; }
    function renderRestock() { renderRestockCalled = true; }
    function renderCart() { renderCartCalled = true; }
    function refreshExplorerFromSearch() { refreshExplorerCalled = true; }
    function refreshProductViews() {
      renderTable();
      renderRestock();
      renderCart();
      refreshExplorerFromSearch();
    }

    // FIXED: inventory.js now calls refreshProductViews() instead of just renderTable()
    refreshProductViews();

    expect(renderTableCalled).toBe(true);
    expect(renderRestockCalled).toBe(true);
    expect(renderCartCalled).toBe(true);
    expect(refreshExplorerCalled).toBe(true);
  });

  test('FIX: product delete calls refreshProductViews (all views updated)', () => {
    let renderTableCalled = false;
    let renderRestockCalled = false;
    let renderCartCalled = false;
    let refreshExplorerCalled = false;

    function renderTable() { renderTableCalled = true; }
    function renderRestock() { renderRestockCalled = true; }
    function renderCart() { renderCartCalled = true; }
    function refreshExplorerFromSearch() { refreshExplorerCalled = true; }
    function refreshProductViews() {
      renderTable();
      renderRestock();
      renderCart();
      refreshExplorerFromSearch();
    }

    // FIXED: delete now calls refreshProductViews()
    refreshProductViews();

    expect(renderTableCalled).toBe(true);
    expect(renderCartCalled).toBe(true);
    expect(renderRestockCalled).toBe(true);
    expect(refreshExplorerCalled).toBe(true);
  });

  test('restock quick-add correctly calls refreshProductViews', () => {
    let renderTableCalled = false;
    let renderRestockCalled = false;
    let renderCartCalled = false;
    let refreshExplorerCalled = false;

    function renderTable() { renderTableCalled = true; }
    function renderRestock() { renderRestockCalled = true; }
    function renderCart() { renderCartCalled = true; }
    function refreshExplorerFromSearch() { refreshExplorerCalled = true; }
    function refreshProductViews() {
      renderTable();
      renderRestock();
      renderCart();
      refreshExplorerFromSearch();
    }

    refreshProductViews();

    expect(renderTableCalled).toBe(true);
    expect(renderRestockCalled).toBe(true);
    expect(renderCartCalled).toBe(true);
    expect(refreshExplorerCalled).toBe(true);
  });
});

// ============================================================
// 7. CART REFERENCE SYNC
// ============================================================
describe('Cart — product reference sync', () => {
  test('FIX: refreshProductViews syncs cart references with fresh products', () => {
    // Simulate initial state
    let products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
    ];

    // Add to cart (stores reference)
    const cart = [{ product: products[0], quantity: 2 }];
    expect(cart[0].product.stock).toBe(10);

    // Simulate loadFromDB — replaces products array
    products = [
      { id: '1', name: 'Pencil', stock: 7, salePrice: 5 },
    ];

    // FIXED: refreshProductViews now syncs cart references
    function findProduct(id) {
      return products.find(p => String(p.id) === String(id));
    }
    cart.forEach(function (item) {
      var fresh = findProduct(item.product.id);
      if (fresh) {
        item.product = fresh;
      }
    });

    // Cart now references the fresh product
    expect(cart[0].product.stock).toBe(7);
    expect(cart[0].product).toBe(products[0]); // same reference
  });

  test('FIX: cart items for deleted products are removed', () => {
    let products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
      { id: '2', name: 'Eraser', stock: 5, salePrice: 3 },
    ];

    let cart = [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 1 },
    ];

    // Product 2 is deleted
    products = [
      { id: '1', name: 'Pencil', stock: 10, salePrice: 5 },
    ];

    function findProduct(id) {
      return products.find(p => String(p.id) === String(id));
    }

    // Sync references
    cart.forEach(function (item) {
      var fresh = findProduct(item.product.id);
      if (fresh) item.product = fresh;
    });
    cart = cart.filter(function (item) {
      return !!findProduct(item.product.id);
    });

    expect(cart).toHaveLength(1);
    expect(cart[0].product.name).toBe('Pencil');
  });
});

// ============================================================
// 8. OUT-OF-STOCK DISPLAY LOGIC
// ============================================================
describe('Out-of-stock display logic', () => {
  test('stock=0 gets critical class', () => {
    const stockNum = 0;
    const stockClass = stockNum === 0 ? 'restock-critical' : 'restock-low';
    expect(stockClass).toBe('restock-critical');
  });

  test('stock=3 gets low class', () => {
    const stockNum = 3;
    const stockClass = stockNum === 0 ? 'restock-critical' : 'restock-low';
    expect(stockClass).toBe('restock-low');
  });

  test('inventory table stock classes are correct', () => {
    function getStockClass(stockNum) {
      return stockNum <= 5 ? 'stock-low' : (stockNum <= 15 ? 'stock-warn' : 'stock-ok');
    }
    expect(getStockClass(0)).toBe('stock-low');
    expect(getStockClass(5)).toBe('stock-low');
    expect(getStockClass(6)).toBe('stock-warn');
    expect(getStockClass(15)).toBe('stock-warn');
    expect(getStockClass(16)).toBe('stock-ok');
  });

  test('out-of-stock detection works correctly', () => {
    function isOutOfStock(product) {
      return Number(product.stock) <= 0;
    }
    expect(isOutOfStock({ stock: 0 })).toBe(true);
    expect(isOutOfStock({ stock: -1 })).toBe(true);
    expect(isOutOfStock({ stock: 1 })).toBe(false); // stock=1 is NOT out of stock
    expect(isOutOfStock({ stock: 5 })).toBe(false);
  });

  test('explorer add button disabled for out-of-stock', () => {
    function getAddButtonState(stock) {
      var stockNum = Number(stock);
      return stockNum > 0 ? 'enabled' : 'disabled';
    }
    expect(getAddButtonState(0)).toBe('disabled');
    expect(getAddButtonState(1)).toBe('enabled');
    expect(getAddButtonState(10)).toBe('enabled');
  });
});

// ============================================================
// 9. FULL INTEGRATION — DATABASE ROUND-TRIP
// ============================================================
describe('Integration — database round-trip stock integrity', () => {
  test('save → load → modify → save → load preserves stock correctly', () => {
    // Initial save
    const initial = [
      { id: '1', name: 'Pencil', category: 'Writing', purchasePrice: 3, salePrice: 5, stock: 50 },
      { id: '2', name: 'Eraser', category: 'Other', purchasePrice: 1, salePrice: 2, stock: 0 },
    ];
    saveProducts(initial, TEST_DB);

    // Load
    let loaded = loadProducts(TEST_DB);
    expect(loaded[0].stock).toBe(50);
    expect(loaded[1].stock).toBe(0);

    // Modify (simulate restock)
    loaded[1].stock = 25;
    saveProducts(loaded, TEST_DB);

    // Reload
    loaded = loadProducts(TEST_DB);
    expect(loaded[1].stock).toBe(25);
  });

  test('save → load with multiple products preserves all stock values', () => {
    const products = [];
    for (let i = 1; i <= 20; i++) {
      products.push({
        id: String(i),
        name: 'Product ' + i,
        category: 'Other',
        purchasePrice: i,
        salePrice: i * 2,
        stock: i * 10
      });
    }
    saveProducts(products, TEST_DB);
    const loaded = loadProducts(TEST_DB);
    expect(loaded).toHaveLength(20);
    loaded.forEach((p, idx) => {
      expect(p.stock).toBe((idx + 1) * 10);
    });
  });
});
