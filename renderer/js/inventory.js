// ---- INVENTORY TABLE ----
var tableBody    = $id('tableBody');
var searchInput  = $id('searchInput');
var productCount = $id('productCount');

function renderTable(data) {
  if (!tableBody) return;
  tableBody.innerHTML = '';

  var arr = data || products;
  if (!arr || arr.length === 0) {
    tableBody.innerHTML = '<tr class="empty-row"><td colspan="9">' + t('noProducts') + '</td></tr>';
    if (productCount) productCount.textContent = t('productsCount', 0);
    return;
  }

  arr.forEach(function (p) {
    var stockNum   = Number(p.stock);
    var stockClass = stockNum <= 5 ? 'stock-low' : (stockNum <= 15 ? 'stock-warn' : 'stock-ok');
    var profit     = Number(p.salePrice) - Number(p.purchasePrice);
    var catKey     = 'categories.' + p.category;
    var catName    = t(catKey);
    if (catName === catKey) catName = escapeHtml(p.category);

    var boxBadge = p.soldByBox
      ? '<span class="badge badge-box" title="' + t('boxBadgeTitle', p.boxUnits) + '">' + t('boxColumn') + '</span>'
      : '<span class="badge badge-no">--</span>';

    var tr = document.createElement('tr');
    tr.className = 'product-row';
    tr.dataset.id = p.id;
    tr.innerHTML =
      '<td class="barcode-cell">' + escapeHtml(String(p.barcode || '') || '--') + '</td>' +
      '<td>' + escapeHtml(p.name) + '</td>' +
      '<td><span class="category-tag">' + catName + '</span></td>' +
      '<td>' + formatCurrency(p.purchasePrice) + '</td>' +
      '<td>' + formatCurrency(p.salePrice) + '</td>' +
      '<td class="' + (profit > 0 ? 'profit-positive' : 'profit-negative') + '">' + formatProfit(profit) + '</td>' +
      '<td><span class="stock-chip ' + stockClass + '">' + p.stock + '</span></td>' +
      '<td>' + boxBadge + '</td>' +
      '<td class="actions-cell">' +
        '<button class="btn btn-small btn-edit-icon" title="' + t('edit') + '" aria-label="' + t('edit') + '">' + t('edit') + '</button>' +
        '<button class="btn btn-small btn-delete-icon" title="' + t('delete') + '" aria-label="' + t('delete') + '">' + t('delete') + '</button>' +
      '</td>';
    tableBody.appendChild(tr);
  });

  if (productCount) productCount.textContent = t('productsCount', arr.length);
}

function rebuildTableHead() {
  var thead = $sel('#productsTable thead tr');
  if (!thead) return;
  thead.innerHTML =
    '<th>' + t('barcode') + '</th><th>' + t('name') + '</th><th>' + t('category') + '</th>' +
    '<th>' + t('purch') + '</th><th>' + t('sale') + '</th><th>' + t('profit') + '</th>' +
    '<th>' + t('stock') + '</th><th>' + t('boxColumn') + '</th><th>' + t('actions') + '</th>';
}

function filterTable() {
  var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (!q) { renderTable(products); return; }
  var filtered = products.filter(function (p) {
    var catKey = 'categories.' + p.category;
    var catName = t(catKey);
    if (catName === catKey) catName = p.category || '';
    return String(p.barcode || '').toLowerCase().indexOf(q) !== -1 ||
           (p.name     || '').toLowerCase().indexOf(q) !== -1 ||
           catName.toLowerCase().indexOf(q) !== -1;
  });
  renderTable(filtered);
}

function getCanonicalCategory(inputVal) {
  var val = (inputVal || '').trim();
  if (!val) return '';

  for (var l in i18n) {
    var cats = i18n[l].categories;
    if (cats) {
      if (cats[val]) {
        return val;
      }
      for (var key in cats) {
        if (cats[key].toLowerCase() === val.toLowerCase()) {
          return key;
        }
      }
    }
  }
  return val;
}

// ---- CATEGORIES ----
var categorySelect = $id('category');
var categoryDatalist = $id('categoryList');

function updateCategoryOptions() {
  if (!categoryDatalist) return;
  categoryDatalist.innerHTML = '';

  // 1. Default categories from i18n using translated name as value
  var cats = i18n[lang].categories;
  Object.keys(cats).forEach(function (key) {
    var opt = document.createElement('option');
    opt.value = cats[key];
    categoryDatalist.appendChild(opt);
  });

  // 2. Unique custom categories in DB
  var uniqueCats = {};
  if (Array.isArray(products)) {
    products.forEach(function (p) {
      if (p.category) {
        var catKey = 'categories.' + p.category;
        var catName = t(catKey);
        if (catName === catKey) catName = p.category;

        var isDefault = false;
        for (var k in cats) {
          if (cats[k].toLowerCase() === catName.toLowerCase()) {
            isDefault = true;
            break;
          }
        }
        if (!isDefault) {
          uniqueCats[catName] = true;
        }
      }
    });
  }
  Object.keys(uniqueCats).forEach(function (cat) {
    var opt = document.createElement('option');
    opt.value = cat;
    categoryDatalist.appendChild(opt);
  });
}

// ---- FORM ----
var form                 = $id('productForm');
var editingId            = $id('editingId');
var idInput              = $id('id');
var nameInput            = $id('name');
var barcodeInput         = $id('barcode');
var purchasePriceInput   = $id('purchasePrice');
var salePriceInput       = $id('salePrice');
var stockInput           = $id('stock');
var soldByBoxCheckbox    = $id('soldByBox');
var boxFields            = $id('boxFields');
var boxUnitsInput        = $id('boxUnits');
var boxPurchasePriceInput = $id('boxPurchasePrice');
var boxSalePriceInput    = $id('boxSalePrice');
var unitProfitEl         = $id('unitProfit');
var boxUnitProfitEl      = $id('boxUnitProfit');
var boxTotalProfitEl     = $id('boxTotalProfit');
var btnSubmit            = $id('btnSubmit');
var btnCancel            = $id('btnCancel');
var formTitle            = $id('formTitle');

function getFormData() {
  var soldByBox = soldByBoxCheckbox ? soldByBoxCheckbox.checked : false;
  return {
    id:               (idInput ? idInput.value.trim() : '') || getNextId(),
    name:             nameInput ? nameInput.value.trim() : '',
    barcode:          barcodeInput ? barcodeInput.value.trim() : '',
    category:         getCanonicalCategory(categorySelect ? categorySelect.value.trim() : ''),
    purchasePrice:    parseFloat(purchasePriceInput ? purchasePriceInput.value : 0) || 0,
    salePrice:        parseFloat(salePriceInput ? salePriceInput.value : 0) || 0,
    stock:            parseInt(stockInput ? stockInput.value : 0) || 0,
    soldByBox:        soldByBox,
    boxUnits:         soldByBox ? (parseInt(boxUnitsInput ? boxUnitsInput.value : 0) || 0) : 0,
    boxPurchasePrice: soldByBox ? (parseFloat(boxPurchasePriceInput ? boxPurchasePriceInput.value : 0) || 0) : 0,
    boxSalePrice:     soldByBox ? (parseFloat(boxSalePriceInput ? boxSalePriceInput.value : 0) || 0) : 0
  };
}

function fillForm(product) {
  if (!editingId) return;
  editingId.value    = product.id;
  if (idInput)       idInput.value       = product.id;
  if (nameInput)     nameInput.value     = product.name;
  if (barcodeInput)  barcodeInput.value  = String(product.barcode || '');
  if (categorySelect) {
    var catKey = 'categories.' + product.category;
    var catName = t(catKey);
    if (catName === catKey) catName = product.category;
    categorySelect.value = catName;
  }
  if (purchasePriceInput) purchasePriceInput.value = product.purchasePrice;
  if (salePriceInput)     salePriceInput.value     = product.salePrice;
  if (stockInput)         stockInput.value         = product.stock;
  if (soldByBoxCheckbox)  soldByBoxCheckbox.checked = product.soldByBox;
  if (boxFields)          boxFields.style.display   = product.soldByBox ? 'flex' : 'none';
  if (product.soldByBox) {
    if (boxUnitsInput)         boxUnitsInput.value         = product.boxUnits || '';
    if (boxPurchasePriceInput) boxPurchasePriceInput.value = product.boxPurchasePrice || '';
    if (boxSalePriceInput)     boxSalePriceInput.value     = product.boxSalePrice || '';
  }
  setText(formTitle, 'editProduct');
  setText(btnSubmit, 'update');
  if (btnCancel) btnCancel.style.display = 'inline-block';
  if (nameInput) nameInput.focus();
  updateProfitCalculations();
  switchTab('inventory');
}

function resetForm() {
  if (form)        form.reset();
  if (editingId)   editingId.value = '';
  if (idInput)     idInput.value   = '';
  if (boxFields)   boxFields.style.display = 'none';
  if (unitProfitEl)    { unitProfitEl.textContent    = '--'; unitProfitEl.className    = 'metric-value'; }
  if (boxUnitProfitEl) { boxUnitProfitEl.textContent = '--'; boxUnitProfitEl.className = 'metric-value'; }
  if (boxTotalProfitEl){ boxTotalProfitEl.textContent = '--'; boxTotalProfitEl.className = 'metric-value'; }
  translateAllUI();
  updateCategoryOptions();
}

function updateProfitCalculations() {
  var pp = parseFloat(purchasePriceInput ? purchasePriceInput.value : 0) || 0;
  var sp = parseFloat(salePriceInput ? salePriceInput.value : 0) || 0;
  var unitProfit = sp - pp;
  if (unitProfitEl) {
    unitProfitEl.textContent = formatProfit(unitProfit);
    unitProfitEl.className   = 'metric-value ' + (unitProfit >= 0 ? 'profit-positive' : 'profit-negative');
  }
  if (soldByBoxCheckbox && soldByBoxCheckbox.checked) {
    var bpp = parseFloat(boxPurchasePriceInput ? boxPurchasePriceInput.value : 0) || 0;
    var bsp = parseFloat(boxSalePriceInput ? boxSalePriceInput.value : 0) || 0;
    var bu  = parseInt(boxUnitsInput ? boxUnitsInput.value : 0) || 0;
    var boxUnitProfit  = bu > 0 ? (bsp / bu) - pp : 0;
    var boxTotalProfit = bsp - bpp;
    if (boxUnitProfitEl)  { boxUnitProfitEl.textContent  = formatProfit(boxUnitProfit);  boxUnitProfitEl.className  = 'metric-value ' + (boxUnitProfit >= 0 ? 'profit-positive' : 'profit-negative'); }
    if (boxTotalProfitEl) { boxTotalProfitEl.textContent = formatProfit(boxTotalProfit); boxTotalProfitEl.className = 'metric-value ' + (boxTotalProfit >= 0 ? 'profit-positive' : 'profit-negative'); }
  }
}

// ---- FORM SUBMIT ----
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var data = getFormData();
    if (!data.name) { showToast(t('nameRequired'), 'error'); return; }

    var idx = findProductIndex(data.id);
    if (idx !== -1) {
      products[idx] = Object.assign(products[idx], data);
      showToast(t('productUpdated'), 'success');
    } else {
      products.push(data);
      showToast(t('productAdded'), 'success');
    }

    await saveToDB();
    resetForm();
    renderTable();
    switchTab('inventory');
  });
}

if (btnCancel) btnCancel.addEventListener('click', resetForm);

// ---- SOLD BY BOX TOGGLE ----
if (soldByBoxCheckbox) {
  soldByBoxCheckbox.addEventListener('change', function () {
    if (boxFields) boxFields.style.display = soldByBoxCheckbox.checked ? 'flex' : 'none';
    updateProfitCalculations();
  });
}

// ---- BARCODE AUTO-DETECT ----
if (barcodeInput) {
  barcodeInput.addEventListener('input', function () {
    var typedBarcode = String(barcodeInput.value || '').trim();
    if (!typedBarcode || typedBarcode === lastAutoFilledId) return;
    var existing = products.find(function (p) { return String(p.barcode || '').toLowerCase() === typedBarcode.toLowerCase(); });
    if (existing) {
      lastAutoFilledId = typedBarcode;
      fillForm(existing);
      showToast(t('duplicateBarcode'), 'info');
    } else {
      lastAutoFilledId = '';
    }
  });
}

// ---- PROFIT CALC ON INPUT CHANGE ----
[purchasePriceInput, salePriceInput, boxPurchasePriceInput, boxSalePriceInput, boxUnitsInput].forEach(function (el) {
  if (el) el.addEventListener('input', updateProfitCalculations);
});

// ---- DELETE PRODUCT (modal) ----
var deleteConfirmOverlay = $id('deleteConfirmOverlay');
var deleteProductName    = $id('deleteProductName');
var deleteConfirmBtn     = $id('deleteConfirmBtn');
var deleteCancelBtn      = $id('deleteCancelBtn');

function openDeleteModal(id) {
  pendingDeleteId = id;
  var product = findProduct(id);
  if (deleteProductName && product) deleteProductName.textContent = product.name;
  if (deleteConfirmOverlay) deleteConfirmOverlay.classList.remove('hidden');
  translateDeleteModal();
}

function closeDeleteModal() {
  if (deleteConfirmOverlay) deleteConfirmOverlay.classList.add('hidden');
  pendingDeleteId = null;
}

function translateDeleteModal() {
  setText('deleteConfirmTitle', 'deleteConfirmTitle');
  setText('deleteConfirmBtn',  'deleteConfirmBtn');
  setText('deleteCancelBtn',   'cancel');
  var delDesc = $sel('#deleteConfirmOverlay .modal-desc');
  if (delDesc) {
    var prodName = (deleteProductName && deleteProductName.textContent) || '';
    delDesc.innerHTML = t('deleteConfirmDesc') + ' <strong>' + escapeHtml(prodName) + '</strong>?';
  }
}

if (deleteConfirmBtn) {
  deleteConfirmBtn.addEventListener('click', async function () {
    if (!pendingDeleteId) return;
    products = products.filter(function (x) { return x.id !== pendingDeleteId; });
    cart = cart.filter(function (item) { return item.product.id !== pendingDeleteId; });
    await saveToDB();
    renderCart();
    renderTable();
    closeDeleteModal();
    showToast(t('productDeleted'), 'info');
  });
}

if (deleteCancelBtn) {
  deleteCancelBtn.addEventListener('click', closeDeleteModal);
}

if (deleteConfirmOverlay) {
  deleteConfirmOverlay.addEventListener('click', function (e) {
    if (e.target === deleteConfirmOverlay) closeDeleteModal();
  });
}

// ---- TABLE ACTIONS ----
if (tableBody) {
  tableBody.addEventListener('click', function (e) {
    var editBtn = e.target.closest('.btn-edit-icon');
    if (editBtn) {
      e.stopPropagation();
      var row = editBtn.closest('tr');
      if (row && row.dataset.id) {
        var product = findProduct(row.dataset.id);
        if (product) fillForm(product);
      }
      return;
    }
    var delBtn = e.target.closest('.btn-delete-icon');
    if (delBtn) {
      e.stopPropagation();
      var row = delBtn.closest('tr');
      if (row && row.dataset.id) openDeleteModal(row.dataset.id);
    }
  });
}

// ---- SEARCH FILTER ----
if (searchInput) searchInput.addEventListener('input', filterTable);

// ---- EXPORT / IMPORT ----
var btnExport = $id('btnExport');
if (btnExport) {
  btnExport.addEventListener('click', async function () {
    try { await window.api.saveExcel(); showToast(t('exportedOk'), 'success'); }
    catch (err) { console.error(err); showToast(t('exportFailed'), 'error'); }
  });
}

var modalImportBtn = $id('modalImportBtn');
if (modalImportBtn) {
  modalImportBtn.addEventListener('click', async function () {
    try {
      await window.api.openExcel();
      showToast(t('importedOk'), 'info');
      await loadFromDB();
      cart = [];
      renderCart();
      renderTable();
      var projectOverlay = $id('projectsOverlay');
      if (projectOverlay) projectOverlay.classList.add('hidden');
    } catch (err) { console.error(err); showToast(t('importFailed'), 'error'); }
  });
}
