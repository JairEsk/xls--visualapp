// ---- EXPLORER / POS ----
var explorerSearch  = $id('explorerSearch');
var explorerResults = $id('explorerResults');

// ---- CART ----
function addToCart(product, qty) {
  qty = qty || 1;
  var existing = cart.find(function (item) { return item.product.id === product.id; });
  if (existing) {
    if (existing.quantity + qty > existing.product.stock) {
      showToast(t('insufficientStock') + ' ' + existing.product.name, 'error');
      return;
    }
    existing.quantity += qty;
  } else {
    if (qty > product.stock) {
      showToast(t('insufficientStock') + ' ' + product.name, 'error');
      return;
    }
    cart.push({ product: product, quantity: qty });
  }
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateCartQuantity(index, delta) {
  var item = cart[index];
  var newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(index);
    return;
  }
  if (newQty > item.product.stock) {
    showToast(t('insufficientStock') + ' ' + item.product.name, 'error');
    return;
  }
  item.quantity = newQty;
  renderCart();
}

function calculateCartTotals() {
  var totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
  var total = cart.reduce(function (sum, item) { return sum + (item.product.salePrice * item.quantity); }, 0);
  return { totalItems: totalItems, total: total };
}

function renderCart() {
  var cartBody = $id('cartBody');
  var cartItemCount = $id('cartItemCount');
  var cartTotalValue = $id('cartTotalValue');

  var totals = calculateCartTotals();

  if (cart.length === 0) {
    cartBody.innerHTML = '<div class="cart-empty" id="cartEmptyMsg">' + t('cartEmptyText') + '</div>';
    if (cartItemCount) cartItemCount.textContent = t('cartItems', 0);
    if (cartTotalValue) cartTotalValue.textContent = '$0.00';
    return;
  }

  var html = '<div class="cart-items">';
  cart.forEach(function (item, i) {
    var subtotal = item.product.salePrice * item.quantity;
    html +=
      '<div class="cart-item-row">' +
        '<div class="cart-item-info">' +
          '<span class="cart-item-name">' + escapeHtml(item.product.name) + '</span>' +
          '<span class="cart-item-price">' + formatCurrency(item.product.salePrice) + ' /u</span>' +
        '</div>' +
        '<div class="cart-item-controls">' +
          '<button class="btn btn-small btn-quantity" data-action="decrease" data-index="' + i + '">&minus;</button>' +
          '<span class="cart-item-qty">' + item.quantity + '</span>' +
          '<button class="btn btn-small btn-quantity" data-action="increase" data-index="' + i + '">+</button>' +
        '</div>' +
        '<span class="cart-item-subtotal">' + formatCurrency(subtotal) + '</span>' +
        '<button class="btn btn-small btn-remove-item" data-index="' + i + '" title="' + (lang === 'es' ? 'Quitar' : 'Remove') + '">&#x2715;</button>' +
      '</div>';
  });
  html += '</div>';
  cartBody.innerHTML = html;

  if (cartItemCount) cartItemCount.textContent = t('cartItems', totals.totalItems);
  if (cartTotalValue) cartTotalValue.textContent = formatCurrency(totals.total);
}

var saleConfirmOverlay = $id('saleConfirmOverlay');
var saleConfirmBtn = $id('saleConfirmBtn');
var saleCancelBtn = $id('saleCancelBtn');

function getQuickCashSuggestions(total) {
  var denoms = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
  var filtered = denoms.filter(function(d) { return d >= total; });
  var suggestions = filtered.slice(0, 3);
  if (suggestions.indexOf(total) === -1) {
    suggestions.unshift(total);
  }
  return suggestions.filter(function(v, i, self) { return self.indexOf(v) === i; }).slice(0, 4);
}

function updateChangeCalculation(total) {
  var cashInput = $id('cashReceived');
  var changeDueVal = $id('changeDueVal');
  var lblChangeDue = $id('lblChangeDue');
  var saleConfirmBtn = $id('saleConfirmBtn');
  var saleConfirmChangeRow = $id('saleConfirmChangeRow');
  
  if (!cashInput || !changeDueVal || !saleConfirmBtn) return;
  
  var cashVal = parseFloat(cashInput.value);
  if (isNaN(cashVal) || cashInput.value.trim() === '') {
    changeDueVal.textContent = formatCurrency(0);
    if (lblChangeDue) lblChangeDue.textContent = t('lblChangeDue');
    if (saleConfirmChangeRow) saleConfirmChangeRow.classList.remove('insufficient-cash');
    saleConfirmBtn.disabled = false;
    return;
  }
  
  var change = cashVal - total;
  if (change < 0) {
    changeDueVal.textContent = formatCurrency(Math.abs(change));
    if (lblChangeDue) lblChangeDue.textContent = t('insufficientCash');
    if (saleConfirmChangeRow) saleConfirmChangeRow.classList.add('insufficient-cash');
    saleConfirmBtn.disabled = true;
  } else {
    changeDueVal.textContent = formatCurrency(change);
    if (lblChangeDue) lblChangeDue.textContent = t('lblChangeDue');
    if (saleConfirmChangeRow) saleConfirmChangeRow.classList.remove('insufficient-cash');
    saleConfirmBtn.disabled = false;
  }
}

function generateQuickCashButtons(total) {
  var container = $id('quickCashBtns');
  if (!container) return;
  container.innerHTML = '';
  
  var suggestions = getQuickCashSuggestions(total);
  suggestions.forEach(function(val) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-quick-cash';
    btn.textContent = formatCurrency(val);
    btn.addEventListener('click', function() {
      var cashInput = $id('cashReceived');
      if (cashInput) {
        cashInput.value = val.toFixed(2);
        updateChangeCalculation(total);
      }
    });
    container.appendChild(btn);
  });
}

function openSaleConfirmModal() {
  if (cart.length === 0) return;
  
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var freshProduct = findProduct(item.product.id);
    if (!freshProduct || freshProduct.stock < item.quantity) {
      showToast(t('insufficientStock') + ' ' + item.product.name, 'error');
      return;
    }
  }

  var totals = calculateCartTotals();
  var totalVal = totals.total;

  var saleConfirmTotalVal = $id('saleConfirmTotalVal');
  if (saleConfirmTotalVal) saleConfirmTotalVal.textContent = formatCurrency(totalVal);

  var cashInput = $id('cashReceived');
  if (cashInput) {
    cashInput.value = '';
  }

  if (saleConfirmOverlay) {
    saleConfirmOverlay.classList.remove('hidden');
    setText('saleConfirmTitle', 'saleConfirmTitle');
    setText('saleConfirmDesc', 'saleConfirmDesc');
    setText('lblConfirmTotal', 'lblConfirmTotal');
    setText('lblCashReceived', 'lblCashReceived');
    setText('lblChangeDue', 'lblChangeDue');
    setText('saleConfirmBtn', 'saleConfirmBtn');
    setText('saleCancelBtn', 'cancel');
  }

  updateChangeCalculation(totalVal);
  generateQuickCashButtons(totalVal);

  if (cashInput) {
    setTimeout(function() {
      cashInput.focus();
      cashInput.select();
    }, 100);
  }
}

function closeSaleConfirmModal() {
  if (saleConfirmOverlay) saleConfirmOverlay.classList.add('hidden');
}

if (saleConfirmBtn) {
  saleConfirmBtn.addEventListener('click', async function () {
    closeSaleConfirmModal();
    await executeCompleteSale();
  });
}

if (saleCancelBtn) {
  saleCancelBtn.addEventListener('click', closeSaleConfirmModal);
}

if (saleConfirmOverlay) {
  saleConfirmOverlay.addEventListener('click', function (e) {
    if (e.target === saleConfirmOverlay) closeSaleConfirmModal();
  });
}

var cashReceivedInput = $id('cashReceived');
if (cashReceivedInput) {
  cashReceivedInput.addEventListener('input', function() {
    var totals = calculateCartTotals();
    updateChangeCalculation(totals.total);
  });
  
  cashReceivedInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var btn = $id('saleConfirmBtn');
      if (btn && !btn.disabled) {
        btn.click();
      }
    }
  });
}

async function executeCompleteSale() {
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var freshProduct = findProduct(item.product.id);
    if (!freshProduct || freshProduct.stock < item.quantity) {
      showToast(t('insufficientStock') + ' ' + item.product.name, 'error');
      return;
    }
  }

  var totals = calculateCartTotals();
  var cashInput = $id('cashReceived');
  var cashVal = cashInput ? parseFloat(cashInput.value) : 0;
  if (isNaN(cashVal)) cashVal = 0;
  var changeVal = cashVal > 0 ? (cashVal - totals.total) : 0;
  if (changeVal < 0) changeVal = 0;

  var detailsArray = cart.map(function (item) {
    return item.quantity + 'x ' + item.product.name + ' ($' + item.product.salePrice.toFixed(2) + ' c/u)';
  });
  var detailsStr = detailsArray.join(', ');

  var now = new Date();
  var yyyy = now.getFullYear();
  var mm = String(now.getMonth() + 1).padStart(2, '0');
  var dd = String(now.getDate()).padStart(2, '0');
  var hh = String(now.getHours()).padStart(2, '0');
  var min = String(now.getMinutes()).padStart(2, '0');
  var ss = String(now.getSeconds()).padStart(2, '0');
  var formattedDate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;

  var paymentMethod = cashVal > 0 ? (lang === 'es' ? 'Efectivo' : 'Cash') : (lang === 'es' ? 'Efectivo' : 'Cash');

  var newSale = {
    date: formattedDate,
    total: totals.total,
    itemsCount: totals.totalItems,
    paymentMethod: paymentMethod,
    details: detailsStr,
    received: cashVal > 0 ? cashVal : totals.total,
    change: changeVal
  };

  cart.forEach(function (item) {
    var product = findProduct(item.product.id);
    if (product) product.stock -= item.quantity;
  });

  sales.push(newSale);

  try {
    await saveToDB();
    await window.api.saveSales(sales, currentDbName);
    await loadFromDB();
  } catch (err) {
    console.error(err);
    showToast(t('dbSaveError'), 'error');
  }

  cart = [];
  renderCart();
  refreshExplorerFromSearch();
  renderTable();
  showToast(t('saleCompleted'), 'success');
}

async function completeSale() {
  openSaleConfirmModal();
}

function cancelSale() {
  cart = [];
  renderCart();
  showToast(t('saleCancelled'), 'info');
}

// ---- EXPLORER PRODUCT CARDS ----
function renderExplorerResults(matches) {
  if (!explorerResults) return;
  if (!matches || matches.length === 0) {
    explorerResults.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
    return;
  }

  var html = '';
  matches.forEach(function (p) {
    var stockNum   = Number(p.stock);
    var stockClass = stockNum <= 5 ? 'stock-low'
                   : (stockNum <= 15 ? 'stock-warn'
                   : 'stock-ok');
    var catKey  = 'categories.' + p.category;
    var catName = t(catKey);
    if (catName === catKey) catName = escapeHtml(p.category);
    var outOfStock = stockNum <= 0;

    html +=
      '<div class="explorer-card">' +
        '<div class="exp-header">' +
          '<span class="exp-name">' + escapeHtml(p.name) + '</span>' +
          '<div class="exp-meta-row">' +
            '<span class="id-tag">#' + p.id + '</span>' +
            '<span class="category-tag">' + catName + '</span>' +
            '<span class="exp-stock ' + stockClass + '">' + (lang === 'es' ? 'Stock: ' : 'Stock: ') + p.stock + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="exp-body">' +
          '<span class="exp-price exp-price-editable" data-id="' + p.id + '" id="exp-price-' + p.id + '">' + formatCurrency(p.salePrice) + '</span>' +
          (outOfStock
            ? '<button class="btn-add-cart" disabled style="background:#94a3b8;cursor:not-allowed">' + (lang === 'es' ? 'Agotado' : 'Sold out') + '</button>'
            : '<button class="btn-add-cart" data-action="addToCart" data-id="' + p.id + '">' + t('addToCartBtn') + '</button>') +
        '</div>' +
      '</div>';
  });

  explorerResults.innerHTML = html;
}

function beginPriceEdit(pid, currentPrice) {
  var priceSpan = $id('exp-price-' + pid);
  if (!priceSpan || priceSpan.querySelector('input')) return;

  var input = document.createElement('input');
  input.type  = 'number';
  input.step  = '0.01';
  input.min   = '0';
  input.value = currentPrice;
  input.className = 'exp-price-input';
  priceSpan.innerHTML = '';
  priceSpan.appendChild(input);
  input.focus();
  input.select();

  function commitPriceEdit() {
    var newPrice = parseFloat(input.value);
    if (isNaN(newPrice) || newPrice < 0) newPrice = currentPrice;

    var product = findProduct(pid);
    if (product) {
      product.salePrice = newPrice;
      var cartItem = cart.find(function (item) { return item.product.id === pid; });
      if (cartItem) cartItem.product.salePrice = newPrice;
    }

    saveToDB().then(function () {
      refreshExplorerFromSearch();
      renderCart();
      renderTable();
      showToast(t('priceUpdated'), 'success');
    });
  }

  function cancelPriceEdit() {
    priceSpan.textContent = formatCurrency(currentPrice);
  }

  input.addEventListener('blur', function () {
    setTimeout(commitPriceEdit, 150);
  });
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter')  { ev.preventDefault(); commitPriceEdit(); }
    if (ev.key === 'Escape') { ev.preventDefault(); cancelPriceEdit(); }
  });
}

function refreshExplorerFromSearch() {
  var q = explorerSearch ? explorerSearch.value.toLowerCase().trim() : '';
  if (!q) {
    explorerResults.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
    return;
  }
  var matches = products.filter(function (p) {
    return String(p.barcode || '').toLowerCase().indexOf(q) !== -1 ||
           (p.name || '').toLowerCase().indexOf(q) !== -1 ||
           String(p.id) === q;
  });
  renderExplorerResults(matches);
}

if (explorerResults) {
  explorerResults.addEventListener('click', function (e) {
    var addBtn = e.target.closest('.btn-add-cart');
    if (addBtn && addBtn.dataset.action === 'addToCart') {
      var product = findProduct(addBtn.dataset.id);
      if (product) addToCart(product);
      return;
    }

    var priceEl = e.target.closest('.exp-price-editable');
    if (priceEl) {
      var pid = priceEl.dataset.id;
      var product = findProduct(pid);
      if (product) beginPriceEdit(pid, Number(product.salePrice));
      return;
    }
  });
}

if (explorerSearch) {
  explorerSearch.addEventListener('input', refreshExplorerFromSearch);
  explorerSearch.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var q = explorerSearch.value.toLowerCase().trim();
      if (!q) return;
      var matches = products.filter(function (p) {
        return String(p.barcode || '').toLowerCase().indexOf(q) !== -1 ||
               (p.name || '').toLowerCase().indexOf(q) !== -1 ||
               String(p.id) === q;
      });
      if (matches.length === 1 && matches[0].stock > 0) {
        addToCart(matches[0]);
        explorerSearch.value = '';
        explorerResults.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
      } else if (matches.length > 0) {
        refreshExplorerFromSearch();
      }
    }
  });
}

var cartBody = $id('cartBody');
if (cartBody) {
  cartBody.addEventListener('click', function (e) {
    var qtyBtn = e.target.closest('.btn-quantity');
    if (qtyBtn) {
      var idx = parseInt(qtyBtn.dataset.index);
      var delta = qtyBtn.dataset.action === 'increase' ? 1 : -1;
      updateCartQuantity(idx, delta);
      return;
    }

    var removeBtn = e.target.closest('.btn-remove-item');
    if (removeBtn) {
      removeFromCart(parseInt(removeBtn.dataset.index));
      return;
    }
  });
}

var btnCompleteSale = $id('btnCompleteSale');
if (btnCompleteSale) btnCompleteSale.addEventListener('click', completeSale);

var btnCancelSale = $id('btnCancelSale');
if (btnCancelSale) btnCancelSale.addEventListener('click', cancelSale);
