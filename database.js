const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

const HEADERS = [
  'id', 'barcode', 'name', 'category', 'purchase_price', 'sale_price',
  'stock', 'sold_by_box', 'box_units',
  'box_purchase_price', 'box_sale_price'
];

const SALES_HEADERS = [
  'date', 'total', 'items_count', 'payment_method', 'details', 'received', 'change'
];

function getDbPath(dbName) {
  var safe = (dbName || 'products').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') || 'products';
  return path.join(DATA_DIR, safe + '.xlsx');
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function createEmptyWorkbook(dbPath) {
  var dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet([], { header: HEADERS });
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, dbPath);
  return true;
}

function loadProducts(dbName) {
  var dbPath = getDbPath(dbName);
  ensureDataDir();
  if (!fs.existsSync(dbPath)) {
    createEmptyWorkbook(dbPath);
    return [];
  }
  var workbook = XLSX.readFile(dbPath);
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rows.map(function(r, i) {
    return {
      id: (r.id !== undefined && r.id !== '') ? String(r.id) : String(i + 1),
      barcode: (r.barcode !== undefined && r.barcode !== null) ? String(r.barcode).trim() : '',
      name: r.name || '',
      category: r.category || '',
      purchasePrice: Number(r.purchase_price) || 0,
      salePrice: Number(r.sale_price) || 0,
      stock: Math.max(0, Number(r.stock) || 0),
      soldByBox: r.sold_by_box === true || r.sold_by_box === 'true' || r.sold_by_box === 1 || r.sold_by_box === '1',
      boxUnits: Number(r.box_units) || 0,
      boxPurchasePrice: Number(r.box_purchase_price) || 0,
      boxSalePrice: Number(r.box_sale_price) || 0
    };
  });
}

function saveProducts(products, dbName) {
  var dbPath = getDbPath(dbName);
  ensureDataDir();
  
  var workbook;
  if (fs.existsSync(dbPath)) {
    workbook = XLSX.readFile(dbPath);
  } else {
    workbook = XLSX.utils.book_new();
  }
  
  var data = products.map(function(p, i) {
    return {
      id: (p.id !== undefined && p.id !== '') ? String(p.id) : String(i + 1),
      barcode: (p.barcode !== undefined && p.barcode !== null) ? String(p.barcode).trim() : '',
      name: p.name || '',
      category: p.category || '',
      purchase_price: Number(p.purchasePrice) || 0,
      sale_price: Number(p.salePrice) || 0,
      stock: Math.max(0, Number(p.stock) || 0),
      sold_by_box: p.soldByBox ? 'true' : 'false',
      box_units: Number(p.boxUnits) || 0,
      box_purchase_price: Number(p.boxPurchasePrice) || 0,
      box_sale_price: Number(p.boxSalePrice) || 0
    };
  });
  
  var ws = XLSX.utils.json_to_sheet(data, { header: HEADERS });
  
  if (workbook.SheetNames.indexOf('Products') !== -1) {
    workbook.Sheets['Products'] = ws;
  } else {
    XLSX.utils.book_append_sheet(workbook, ws, 'Products');
  }
  
  XLSX.writeFile(workbook, dbPath);
  return true;
}

function loadSales(dbName) {
  var dbPath = getDbPath(dbName);
  ensureDataDir();
  if (!fs.existsSync(dbPath)) {
    createEmptyWorkbook(dbPath);
    return [];
  }
  var workbook = XLSX.readFile(dbPath);
  if (workbook.SheetNames.indexOf('Sales') === -1) {
    return [];
  }
  var sheet = workbook.Sheets['Sales'];
  var rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rows.map(function(r) {
    return {
      date: r.date || '',
      total: Number(r.total) || 0,
      itemsCount: Number(r.items_count) || 0,
      paymentMethod: r.payment_method || '',
      details: r.details || '',
      received: Number(r.received) || 0,
      change: Number(r.change) || 0
    };
  });
}

function saveSales(sales, dbName) {
  var dbPath = getDbPath(dbName);
  ensureDataDir();
  
  var workbook;
  if (fs.existsSync(dbPath)) {
    workbook = XLSX.readFile(dbPath);
  } else {
    workbook = XLSX.utils.book_new();
  }
  
  var data = sales.map(function(s) {
    return {
      date: s.date || '',
      total: Number(s.total) || 0,
      items_count: Number(s.itemsCount) || 0,
      payment_method: s.paymentMethod || '',
      details: s.details || '',
      received: Number(s.received) || 0,
      change: Number(s.change) || 0
    };
  });
  
  var ws = XLSX.utils.json_to_sheet(data, { header: SALES_HEADERS });
  
  if (workbook.SheetNames.indexOf('Sales') !== -1) {
    workbook.Sheets['Sales'] = ws;
  } else {
    XLSX.utils.book_append_sheet(workbook, ws, 'Sales');
  }
  
  XLSX.writeFile(workbook, dbPath);
  return true;
}

module.exports = { loadProducts, saveProducts, loadSales, saveSales, HEADERS, SALES_HEADERS, getDbPath };
