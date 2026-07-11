// ============================================================
//  PAPE — Stationery Store Inventory Manager
//  renderer.js  (front-end : i18n, explorer, inventory, modals)
// ============================================================

// ---- I18N ----
var i18n = {
  en: {
    title: 'Stationery Manager',
    tabExplorer: 'Explorer',
    tabInventory: 'Inventory',
    tabRestock: 'Restock',
    tabHelp: 'Help',
    newProject: 'New',
    importExcel: 'Import',
    importExcelModal: 'Import Excel',
    exportExcel: 'Export',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    name: 'Name',
    namePlaceholder: 'e.g. HB #2 Pencil',
    barcode: 'Barcode',
    barcodePlaceholder: 'e.g. 7501234567890',
    category: 'Category',
    categorySelect: 'Select...',
    categories: {
      Writing: 'Writing', Notebooks: 'Notebooks', Art: 'Art',
      Office: 'Office', School: 'School', Paper: 'Paper',
      Adhesives: 'Adhesives', Other: 'Other'
    },
    purchasePrice: 'Purchase Price',
    salePrice: 'Sale Price',
    stock: 'Stock',
    soldByBox: 'Sold by Box',
    soldByBoxHint: 'Enable if product can be bought/sold in boxes',
    unitsPerBox: 'Units per Box',
    boxPurchasePrice: 'Box Purchase Price',
    boxSalePrice: 'Box Sale Price',
    unitProfitBox: 'Unit Profit (Box)',
    boxProfit: 'Box Profit',
    unitProfit: 'Unit Profit',
    add: 'Add',
    update: 'Update',
    cancel: 'Cancel',
    products: 'Products',
    searchPlaceholder: 'Search products...',
    explorerSearch: 'Search or scan product...',
    explorerEmpty: 'Search for a product to see its price.',
    noProducts: 'No products yet. Add one in the Inventory tab.',
    id: 'ID',
    purch: 'Purch.',
    sale: 'Sale',
    profit: 'Profit',
    boxColumn: 'Box',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    renameStore: 'Rename Store',
    enterStoreName: 'Enter store name...',
    save: 'Save',
    productAdded: 'Product added.',
    productUpdated: 'Product updated.',
    productDeleted: 'Product deleted.',
    priceUpdated: 'Sale price updated.',
    duplicateId: 'A product with that ID already exists. Fields have been filled — make your changes and click Update.',
    duplicateBarcode: 'A product with this barcode already exists. Fields have been filled — make your changes and click Update.',
    deleteConfirmTitle: 'Delete Product',
    deleteConfirmDesc: 'Are you sure you want to delete',
    deleteConfirmBtn: 'Delete',
    nameRequired: 'Product name is required.',
    newProjectConfirm: 'Start a new project? This will clear all current products.',
    newProjectCleared: 'New project started. All products cleared.',
    newProjectTitle: 'New Project',
    newProjectDesc: 'Enter a name for the new database.',
    newProjectPlaceholder: 'e.g. Inventory 2026',
    newProjectCreate: 'Create',
    noName: 'Please enter a name for the database.',
    exportedOk: 'Exported successfully.',
    exportFailed: 'Export failed.',
    importedOk: 'Imported successfully. Reload to see changes.',
    importFailed: 'Import failed.',
    dbLoadError: 'Error loading products.',
    dbSaveError: 'Error saving products.',
    helpTitle: 'How to Create Your Own Excel File',
    helpText: 'If you want to manually prepare an Excel file instead of using the app to add products, create a',
    helpText2: 'file with the following column headers:',
    helpHint: "The app auto-creates this file on first launch — you don't usually need to create one manually. Use",
    helpHint2: 'in the Inventory tab instead.',
    none: '(none)',
    dbManagerTitle: 'Projects',
    currentProject: 'Current:',
    dbListEmptyText: 'No projects yet. Create one below.',
    switchTo: 'Switched to: ',
    schemaHeaderCol: 'Column', schemaHeaderType: 'Type', schemaHeaderDesc: 'Description',
    schemaId: 'Unique product identifier',
    schemaBarcode: 'Product barcode (UPC/EAN)',
    schemaName: 'Product name',
    schemaCategory: 'Category',
    schemaPurchasePrice: 'Unit purchase cost',
    schemaSalePrice: 'Unit sale price',
    schemaStock: 'Units in inventory',
    schemaSoldByBox: 'Whether also sold in boxes',
    schemaBoxUnits: 'Units per box',
    schemaBoxPurchasePrice: 'Box purchase cost',
    schemaBoxSalePrice: 'Box sale price',
    productsCount: function (n) { return n + ' product' + (n !== 1 ? 's' : ''); },
    boxBadgeTitle: function (units) { return units + ' units/box'; },
    restockTitle: 'Low Stock Products',
    restockThreshold: '≤ 5 units',
    restockEmpty: 'All products are well stocked.',
    restockUnitsLeft: function (n) { return n + ' left'; }
  },
  es: {
    title: 'Gestor de Papelería',
    tabExplorer: 'Explorador',
    tabInventory: 'Inventario',
    tabRestock: 'Reestock',
    tabHelp: 'Ayuda',
    newProject: 'Nuevo',
    importExcel: 'Importar',
    importExcelModal: 'Importar Excel',
    exportExcel: 'Exportar',
    addProduct: 'Agregar Producto',
    editProduct: 'Editar Producto',
    name: 'Nombre',
    namePlaceholder: 'ej. Lápiz HB #2',
    barcode: 'Código de Barras',
    barcodePlaceholder: 'ej. 7501234567890',
    category: 'Categoría',
    categorySelect: 'Seleccionar...',
    categories: {
      Writing: 'Escritura', Notebooks: 'Cuadernos', Art: 'Arte',
      Office: 'Oficina', School: 'Escolar', Paper: 'Papel',
      Adhesives: 'Adhesivos', Other: 'Otro'
    },
    purchasePrice: 'Precio de Compra',
    salePrice: 'Precio de Venta',
    stock: 'Stock',
    soldByBox: 'Venta por Caja',
    soldByBoxHint: 'Activar si el producto se compra/vende por caja',
    unitsPerBox: 'Unidades por Caja',
    boxPurchasePrice: 'Precio Compra Caja',
    boxSalePrice: 'Precio Venta Caja',
    unitProfitBox: 'Ganancia Unitaria (Caja)',
    boxProfit: 'Ganancia por Caja',
    unitProfit: 'Ganancia Unitaria',
    add: 'Agregar',
    update: 'Actualizar',
    cancel: 'Cancelar',
    products: 'Productos',
    searchPlaceholder: 'Buscar productos...',
    explorerSearch: 'Buscar o escanear producto...',
    explorerEmpty: 'Busca un producto para ver su precio.',
    noProducts: 'Sin productos aún. Agrega uno en la pestaña Inventario.',
    id: 'ID',
    purch: 'Compra',
    sale: 'Venta',
    profit: 'Ganancia',
    boxColumn: 'Caja',
    actions: 'Acciones',
    edit: 'Editar',
    delete: 'Eliminar',
    renameStore: 'Renombrar Tienda',
    enterStoreName: 'Nombre de la tienda...',
    save: 'Guardar',
    productAdded: 'Producto agregado.',
    productUpdated: 'Producto actualizado.',
    productDeleted: 'Producto eliminado.',
    priceUpdated: 'Precio de venta actualizado.',
    duplicateId: 'Ya existe un producto con ese ID. Campos rellenados — haz tus cambios y presiona Actualizar.',
    duplicateBarcode: 'Ya existe un producto con ese código de barras. Campos rellenados — haz tus cambios y presiona Actualizar.',
    deleteConfirmTitle: 'Eliminar Producto',
    deleteConfirmDesc: '¿Estás seguro de eliminar',
    deleteConfirmBtn: 'Eliminar',
    nameRequired: 'El nombre del producto es obligatorio.',
    newProjectConfirm: '¿Iniciar un nuevo proyecto? Se borrarán todos los productos actuales.',
    newProjectCleared: 'Nuevo proyecto iniciado. Todos los productos fueron eliminados.',
    newProjectTitle: 'Nuevo Proyecto',
    newProjectDesc: 'Ingresa un nombre para la nueva base de datos.',
    newProjectPlaceholder: 'ej. Inventario 2026',
    newProjectCreate: 'Crear',
    noName: 'Por favor ingresa un nombre para la base de datos.',
    exportedOk: 'Exportado exitosamente.',
    exportFailed: 'Error al exportar.',
    importedOk: 'Importado exitosamente. Recarga para ver cambios.',
    importFailed: 'Error al importar.',
    dbLoadError: 'Error al cargar productos.',
    dbSaveError: 'Error al guardar productos.',
    helpTitle: 'Cómo Crear tu Propio Archivo Excel',
    helpText: 'Si quieres preparar manualmente un archivo Excel en vez de usar la app para agregar productos, crea un archivo',
    helpText2: 'con las siguientes columnas:',
    helpHint: 'La app crea este archivo automáticamente al iniciar — normalmente no necesitas crearlo manualmente. Usa',
    helpHint2: 'en la pestaña Inventario.',
    none: '(ninguno)',
    dbManagerTitle: 'Proyectos',
    currentProject: 'Actual:',
    dbListEmptyText: 'Sin proyectos aún. Crea uno abajo.',
    switchTo: 'Proyecto cambiado: ',
    schemaHeaderCol: 'Columna', schemaHeaderType: 'Tipo', schemaHeaderDesc: 'Descripción',
    schemaId: 'Identificador único del producto',
    schemaBarcode: 'Código de barras (UPC/EAN)',
    schemaName: 'Nombre del producto',
    schemaCategory: 'Categoría',
    schemaPurchasePrice: 'Costo unitario de compra',
    schemaSalePrice: 'Precio unitario de venta',
    schemaStock: 'Unidades en inventario',
    schemaSoldByBox: 'Si también se vende por caja',
    schemaBoxUnits: 'Unidades por caja',
    schemaBoxPurchasePrice: 'Costo de compra por caja',
    schemaBoxSalePrice: 'Precio de venta por caja',
    productsCount: function (n) { return n + ' producto' + (n !== 1 ? 's' : ''); },
    boxBadgeTitle: function (units) { return units + ' unidades/caja'; },
    restockTitle: 'Productos con Bajo Stock',
    restockThreshold: '≤ 5 unidades',
    restockEmpty: 'Todos los productos tienen buen stock.',
    restockUnitsLeft: function (n) { return n + ' restantes'; }
  }
};

// ---- APPLICATION STATE ----
var products = [];
var lang = 'en';
var currentDbName = '';
var pendingDeleteId = null;
var lastAutoFilledId = '';
var DEFAULT_TITLE = 'Stationery Manager';

// ---- DOM UTILITIES ----
function $id(id)          { return document.getElementById(id); }
function $sel(sel)        { return document.querySelector(sel); }
function $selAll(sel)     { return document.querySelectorAll(sel); }
function escapeHtml(str)  { var d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }

function t(key) {
  var dict = i18n[lang] || i18n.en;
  var val = dict[key];
  if (typeof val === 'function') return val.apply(null, Array.prototype.slice.call(arguments, 1));
  return val !== undefined ? val : (i18n.en[key] || key);
}

function setText(elOrId, key) {
  var el = typeof elOrId === 'string' ? $id(elOrId) : elOrId;
  if (el) el.textContent = t(key);
}

function placehold(elOrId, key) {
  var el = typeof elOrId === 'string' ? $id(elOrId) : elOrId;
  if (el) el.placeholder = t(key);
}

function showToast(message, type) {
  if (!toast) return;
  type = type || 'info';
  toast.textContent = message;
  toast.className = 'toast show toast-' + type;
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function () { toast.className = 'toast hidden'; }, 2500);
}

// ---- FORMATTING ----
function formatCurrency(val) {
  return '$' + Number(val).toFixed(2);
}

function formatProfit(val) {
  var n = Number(val);
  if (n === 0) return '$0.00';
  return n < 0 ? '-$' + Math.abs(n).toFixed(2) : '+$' + n.toFixed(2);
}

function getNextId() {
  if (products.length === 0) return '1';
  var ids = products.map(function (p) { return Number(p.id) || 0; });
  return String(Math.max.apply(null, ids) + 1);
}

// ---- PRODUCT BY ID LOOKUP ----
function findProduct(id) {
  return products.find(function (p) { return String(p.id) === String(id); });
}

function findProductIndex(id) {
  return products.findIndex(function (p) { return String(p.id) === String(id); });
}

// ---- TABS ----
var tabs          = $selAll('.tab');
var tabPanels     = $selAll('.tab-panel');

function switchTab(tabName) {
  tabs.forEach(function (t) { t.classList.remove('active'); });
  tabPanels.forEach(function (p) { p.classList.add('hidden'); });
  var tabEl   = $sel('.tab[data-tab="' + tabName + '"]');
  var panelEl = $id('tab-' + tabName);
  if (tabEl)   tabEl.classList.add('active');
  if (panelEl) panelEl.classList.remove('hidden');
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () { switchTab(tab.dataset.tab); });
});

// ---- PERSISTENCE ----
function apiAvailable() {
  return window.api && typeof window.api.getProducts === 'function';
}

async function loadFromDB() {
  if (!apiAvailable()) return;
  try { products = await window.api.getProducts(currentDbName); renderTable(); }
  catch (err) { console.error(err); showToast(t('dbLoadError'), 'error'); }
}

async function saveToDB() {
  if (!apiAvailable()) return;
  try { await window.api.saveProducts(products, currentDbName); }
  catch (err) { console.error(err); showToast(t('dbSaveError'), 'error'); }
}

// ---- EXPLORER ----
var explorerSearch  = $id('explorerSearch');
var explorerResults = $id('explorerResults');

function renderExplorerResults(matches) {
  if (!explorerResults) return;
  if (!matches || matches.length === 0) {
    explorerResults.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
    return;
  }

  var html = '';
  matches.forEach(function (p) {
    var profit     = Number(p.salePrice) - Number(p.purchasePrice);
    var stockClass = (Number(p.stock) <= 5) ? 'stock-low'
                   : (Number(p.stock) <= 15) ? 'stock-warn'
                   : 'stock-ok';
    var catKey  = 'categories.' + p.category;
    var catName = t(catKey);
    if (catName === catKey) catName = escapeHtml(p.category);

    var boxInfo = '';
    if (p.soldByBox && p.boxUnits > 0) {
      var boxUnitPrice = (Number(p.boxSalePrice || 0) / Number(p.boxUnits)).toFixed(2);
      boxInfo =
        '<div class="exp-row"><span class="exp-label">Caja (' + p.boxUnits + 'u)</span><span class="exp-val">' + formatCurrency(p.boxSalePrice) + '</span></div>' +
        '<div class="exp-row"><span class="exp-label">Precio caja/unidad</span><span class="exp-val">' + formatCurrency(boxUnitPrice) + '</span></div>';
    }

    html +=
      '<div class="explorer-card">' +
        '<div class="exp-header">' +
          '<span class="exp-name">' + escapeHtml(p.name) + '</span>' +
          '<span class="category-tag">' + catName + '</span>' +
        '</div>' +
        '<div class="exp-body">' +
          '<div class="exp-price-group exp-price-editable" data-id="' + p.id + '">' +
            '<span class="exp-price-label">' + t('salePrice') + '</span>' +
            '<span class="exp-price" id="exp-price-' + p.id + '">' + formatCurrency(p.salePrice) + '</span>' +
            '<span class="exp-edit-hint">&#9998;</span>' +
          '</div>' +
          '<div class="exp-meta">' +
            '<div class="exp-row"><span class="exp-label">' + t('purchasePrice') + '</span><span class="exp-val">' + formatCurrency(p.purchasePrice) + '</span></div>' +
            '<div class="exp-row"><span class="exp-label">' + t('profit') + '</span><span class="exp-val ' + (profit >= 0 ? 'profit-positive' : 'profit-negative') + '">' + formatProfit(profit) + '</span></div>' +
            '<div class="exp-row"><span class="exp-label">' + t('stock') + '</span><span class="exp-val ' + stockClass + '">' + p.stock + '</span></div>' +
            boxInfo +
          '</div>' +
        '</div>' +
        '<div class="exp-footer"><span class="id-tag">#' + p.id + '</span></div>' +
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
    if (product) product.salePrice = newPrice;

    saveToDB().then(function () {
      refreshExplorerFromSearch();
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
    var priceGroup = e.target.closest('.exp-price-editable');
    if (!priceGroup) return;
    var pid = priceGroup.dataset.id;
    var product = findProduct(pid);
    if (!product) return;
    beginPriceEdit(pid, Number(product.salePrice));
  });
}

if (explorerSearch) {
  explorerSearch.addEventListener('input', refreshExplorerFromSearch);
}

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
    tr.style.cursor = 'pointer';
    tr.innerHTML =
      '<td><span class="id-tag">#' + p.id + '</span></td>' +
      '<td class="barcode-cell">' + escapeHtml(String(p.barcode || '') || '--') + '</td>' +
      '<td>' + escapeHtml(p.name) + '</td>' +
      '<td><span class="category-tag">' + catName + '</span></td>' +
      '<td>' + formatCurrency(p.purchasePrice) + '</td>' +
      '<td>' + formatCurrency(p.salePrice) + '</td>' +
      '<td class="' + (profit > 0 ? 'profit-positive' : 'profit-negative') + '">' + formatProfit(profit) + '</td>' +
      '<td class="' + stockClass + '">' + p.stock + '</td>' +
      '<td>' + boxBadge + '</td>' +
      '<td class="actions-cell"><button class="btn btn-small btn-delete-icon" title="' + t('delete') + '">-</button></td>';
    tableBody.appendChild(tr);
  });

  if (productCount) productCount.textContent = t('productsCount', arr.length);
  renderRestock();
}

function rebuildTableHead() {
  var thead = $sel('#productsTable thead tr');
  if (!thead) return;
  thead.innerHTML =
    '<th>' + t('id') + '</th><th>' + t('barcode') + '</th><th>' + t('name') + '</th><th>' + t('category') + '</th>' +
    '<th>' + t('purch') + '</th><th>' + t('sale') + '</th><th>' + t('profit') + '</th>' +
    '<th>' + t('stock') + '</th><th>' + t('boxColumn') + '</th><th></th>';
}

function filterTable() {
  var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (!q) { renderTable(products); return; }
  var filtered = products.filter(function (p) {
    return String(p.barcode || '').toLowerCase().indexOf(q) !== -1 ||
           (p.name     || '').toLowerCase().indexOf(q) !== -1 ||
           (p.category || '').toLowerCase().indexOf(q) !== -1;
  });
  renderTable(filtered);
}

// ---- RESTOCK ----
var LOW_STOCK_THRESHOLD = 5;

function renderRestock() {
  var grid = $id('restockGrid');
  var emptyEl = $id('restockEmpty');
  if (!grid) return;

  var lowStock = products.filter(function (p) { return Number(p.stock) <= LOW_STOCK_THRESHOLD; });

  if (lowStock.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  var html = '';
  lowStock.forEach(function (p) {
    var stockNum = Number(p.stock);
    var stockClass = stockNum === 0 ? 'restock-critical' : 'restock-low';
    var catKey = 'categories.' + p.category;
    var catName = t(catKey);
    if (catName === catKey) catName = escapeHtml(p.category);

    var boxInfo = '';
    if (p.soldByBox && p.boxUnits > 0) {
      boxInfo += '<div class="restock-meta-row"><span class="restock-meta-label">' + t('boxColumn') + '</span><span class="restock-meta-val">' + p.boxUnits + ' unidades/caja</span></div>';
    }

    html +=
      '<div class="restock-card ' + stockClass + '">' +
        '<div class="restock-card-header">' +
          '<span class="restock-card-name">' + escapeHtml(p.name) + '</span>' +
          '<span class="category-tag">' + catName + '</span>' +
        '</div>' +
        '<div class="restock-card-body">' +
          '<div class="restock-stock-badge ' + (stockNum === 0 ? 'restock-zero' : 'restock-warn') + '">' + t('restockUnitsLeft', p.stock) + '</div>' +
          '<div class="restock-meta">' +
            '<div class="restock-meta-row"><span class="restock-meta-label">' + t('salePrice') + '</span><span class="restock-meta-val">' + formatCurrency(p.salePrice) + '</span></div>' +
            '<div class="restock-meta-row"><span class="restock-meta-label">' + t('purchasePrice') + '</span><span class="restock-meta-val">' + formatCurrency(p.purchasePrice) + '</span></div>' +
            boxInfo +
          '</div>' +
        '</div>' +
        '<div class="restock-card-footer"><span class="id-tag">#' + p.id + '</span></div>' +
      '</div>';
  });

  grid.innerHTML = html;
}

// ---- CATEGORIES ----
var categorySelect = $id('category');

function updateCategoryOptions() {
  if (!categorySelect) return;
  categorySelect.innerHTML = '<option value="">' + t('categorySelect') + '</option>';
  var cats = i18n[lang].categories;
  Object.keys(cats).forEach(function (key) {
    var opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cats[key];
    categorySelect.appendChild(opt);
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
    category:         categorySelect ? categorySelect.value : '',
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
  if (categorySelect) categorySelect.value = product.category;
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
    await saveToDB();
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

// ---- TABLE ROW CLICK / DELETE ----
if (tableBody) {
  tableBody.addEventListener('click', function (e) {
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
      renderTable();
      if (newProjectOverlay) newProjectOverlay.classList.add('hidden');
    } catch (err) { console.error(err); showToast(t('importFailed'), 'error'); }
  });
}

// ---- LANGUAGE ----
var langToggleBtn = $id('langToggleBtn');

function switchLanguage(newLang) {
  lang = newLang;
  localStorage.setItem('lang', lang);
  updateCategoryOptions();
  translateAllUI();
  rebuildTableHead();
  renderTable();
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', function () {
    switchLanguage(lang === 'en' ? 'es' : 'en');
  });
}

// ---- PROJECTS MANAGER ----
var newProjectOverlay   = $id('newProjectOverlay');
var newProjectInput     = $id('newProjectInput');
var newProjectSave      = $id('newProjectSave');
var newProjectCancelBtn = $id('newProjectCancel');
var dbList              = $id('dbList');
var dbListEmpty         = $id('dbListEmpty');
var currentProjectName  = $id('currentProjectName');

var btnNew = $id('btnNew');
if (btnNew) {
  btnNew.addEventListener('click', async function () {
    if (newProjectOverlay) {
      newProjectInput.value = '';
      newProjectOverlay.classList.remove('hidden');
      await renderDbList();
      newProjectInput.focus();
    }
  });
}

async function renderDbList() {
  if (!dbList) return;
  if (currentProjectName) currentProjectName.textContent = currentDbName || t('none');

  try {
    var list = await window.api.listDatabases();
    if (!list || list.length === 0) {
      dbList.innerHTML = '';
      if (dbListEmpty) dbListEmpty.classList.remove('hidden');
      return;
    }
    if (dbListEmpty) dbListEmpty.classList.add('hidden');
    dbList.innerHTML = '';

    list.forEach(function (name) {
      var isCurrent = name === currentDbName;
      var row = document.createElement('div');
      row.className = 'db-item' + (isCurrent ? ' db-item-active' : '');
      row.innerHTML =
        '<span class="db-item-name">' + escapeHtml(name) + '</span>' +
        (isCurrent
          ? '<span class="db-item-badge">' + (lang === 'es' ? 'Activo' : 'Active') + '</span>'
          : '<button class="btn btn-small btn-primary db-switch-btn" data-name="' + escapeHtml(name) + '">' + (lang === 'es' ? 'Abrir' : 'Open') + '</button>');

      if (!isCurrent) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function (e) {
          if (e.target.classList.contains('db-switch-btn')) return;
          switchToDb(name);
        });
      }
      dbList.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    if (dbListEmpty) dbListEmpty.classList.remove('hidden');
  }
}

async function switchToDb(name) {
  currentDbName = name;
  localStorage.setItem('dbName', name);

  try { products = await window.api.getProducts(name); }
  catch (e) { console.error(e); products = []; }

  updateDbNameLabel();
  updateHelpDbName();
  resetForm();
  renderTable();

  if (explorerResults) {
    explorerResults.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
  }
  if (newProjectOverlay) newProjectOverlay.classList.add('hidden');
  showToast(t('switchTo') + name, 'success');
}

if (newProjectSave) {
  newProjectSave.addEventListener('click', async function () {
    var v = newProjectInput ? newProjectInput.value.trim() : '';
    if (!v) { showToast(t('noName'), 'error'); return; }
    currentDbName = v;
    localStorage.setItem('dbName', v);
    await window.api.newProject(v);
    products = [];
    updateDbNameLabel();
    resetForm();
    renderTable();
    updateHelpDbName();
    await renderDbList();
    if (newProjectInput) newProjectInput.value = '';
    if (newProjectInput) newProjectInput.focus();
    showToast(t('newProjectCleared'), 'success');
  });
}

if (newProjectCancelBtn) {
  newProjectCancelBtn.addEventListener('click', function () {
    if (newProjectOverlay) newProjectOverlay.classList.add('hidden');
  });
}

if (newProjectOverlay) {
  newProjectOverlay.addEventListener('click', function (e) {
    if (e.target === newProjectOverlay) newProjectOverlay.classList.add('hidden');
  });
}

if (newProjectInput) {
  newProjectInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter'  && newProjectSave)     newProjectSave.click();
    if (e.key === 'Escape' && newProjectCancelBtn) newProjectCancelBtn.click();
  });
}

function updateDbNameLabel() {
  var label = $id('dbNameLabel');
  if (!label) return;
  var name = localStorage.getItem('dbName');
  label.textContent = name || '';
  label.style.display = name ? '' : 'none';
  if (name && !currentDbName) currentDbName = name;
}

function updateHelpDbName() {
  var helpInfo = $sel('#tab-help .info-text');
  if (helpInfo) helpInfo.innerHTML = t('helpText') + ' <code>data/' + (currentDbName || 'products') + '.xlsx</code> ' + t('helpText2');
}

// ---- STORE TITLE (modal) ----
var storeTitle    = $id('storeTitle');
var editTitleBtn  = $id('editTitleBtn');
var modalOverlay  = $id('modalOverlay');
var modalInput    = $id('modalInput');
var modalSave     = $id('modalSave');
var modalCancel   = $id('modalCancel');

function loadTitle() {
  var s = localStorage.getItem('storeTitle');
  if (storeTitle) storeTitle.textContent = s || DEFAULT_TITLE;
}

function saveTitle(title) {
  localStorage.setItem('storeTitle', title);
  if (storeTitle) storeTitle.textContent = title;
}

if (editTitleBtn) {
  editTitleBtn.addEventListener('click', function () {
    if (!modalInput || !modalOverlay) return;
    modalInput.value = storeTitle ? storeTitle.textContent : '';
    modalOverlay.classList.remove('hidden');
    modalInput.focus();
    modalInput.select();
  });
}

if (modalSave) {
  modalSave.addEventListener('click', function () {
    var v = modalInput ? modalInput.value.trim() : '';
    if (v) saveTitle(v);
    if (modalOverlay) modalOverlay.classList.add('hidden');
  });
}

if (modalCancel) {
  modalCancel.addEventListener('click', function () {
    if (modalOverlay) modalOverlay.classList.add('hidden');
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
  });
}

if (modalInput) {
  modalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter'  && modalSave)   modalSave.click();
    if (e.key === 'Escape' && modalCancel) modalCancel.click();
  });
}

// ---- TRANSLATE ALL UI ----
function translateAllUI() {
  document.title = t('title');
  setText('tabExplorerBtn',  'tabExplorer');
  setText('tabInventoryBtn', 'tabInventory');
  setText('tabRestockBtn',   'tabRestock');
  setText('tabHelpBtn',      'tabHelp');
  setText('btnNew',          'newProject');
  setText('btnExport',       'exportExcel');

  var isEditing = editingId && editingId.value;
  setText('formTitle', isEditing ? 'editProduct' : 'addProduct');
  setText('btnSubmit', isEditing ? 'update' : 'add');
  setText('btnCancel', 'cancel');

  var el;
  el = $sel('label[for="barcode"]');         if (el) el.textContent = t('barcode');
  el = $sel('label[for="name"]');            if (el) el.textContent = t('name');
  el = $sel('label[for="category"]');        if (el) el.textContent = t('category');
  el = $sel('label[for="purchasePrice"]');   if (el) el.textContent = t('purchasePrice');
  el = $sel('label[for="salePrice"]');       if (el) el.textContent = t('salePrice');
  el = $sel('label[for="stock"]');           if (el) el.textContent = t('stock');
  el = $sel('label[for="boxUnits"]');        if (el) el.textContent = t('unitsPerBox');
  el = $sel('label[for="boxPurchasePrice"]'); if (el) el.textContent = t('boxPurchasePrice');
  el = $sel('label[for="boxSalePrice"]');    if (el) el.textContent = t('boxSalePrice');
  el = $sel('#soldByBox + span, .checkbox-label span'); if (el) el.textContent = t('soldByBox');

  var smallEl = $sel('.form-group small');
  if (smallEl) smallEl.textContent = t('soldByBoxHint');

  var boxLabels = $selAll('#boxMetrics label');
  if (boxLabels[0]) boxLabels[0].textContent = t('unitProfitBox');
  if (boxLabels[1]) boxLabels[1].textContent = t('boxProfit');

  el = $sel('#form-group-unit-profit label');
  if (el) el.textContent = t('unitProfit');

  helpTab: {
    var helpPanel = $id('tab-help');
    if (!helpPanel) break helpTab;
    var helpH2 = $sel('#tab-help h2');
    if (helpH2) helpH2.textContent = t('helpTitle');

    var helpInfo = $sel('#tab-help .info-text');
    if (helpInfo) helpInfo.innerHTML = t('helpText') + ' <code>data/' + (currentDbName || 'products') + '.xlsx</code> ' + t('helpText2');

    var helpHint = $sel('#tab-help .info-hint');
    if (helpHint) helpHint.innerHTML = t('helpHint') + ' <strong>' + t('addProduct') + '</strong> ' + t('helpHint2');
  }

  schema: {
    var schemaBody = $id('schemaBody');
    if (!schemaBody) break schema;
    schemaBody.innerHTML =
      '<tr><td>id</td><td>text</td><td>' + t('schemaId') + '</td></tr>' +
      '<tr><td>barcode</td><td>text</td><td>' + t('schemaBarcode') + '</td></tr>' +
      '<tr><td>name</td><td>text</td><td>' + t('schemaName') + '</td></tr>' +
      '<tr><td>category</td><td>text</td><td>' + t('schemaCategory') + '</td></tr>' +
      '<tr><td>purchase_price</td><td>number</td><td>' + t('schemaPurchasePrice') + '</td></tr>' +
      '<tr><td>sale_price</td><td>number</td><td>' + t('schemaSalePrice') + '</td></tr>' +
      '<tr><td>stock</td><td>number</td><td>' + t('schemaStock') + '</td></tr>' +
      '<tr><td>sold_by_box</td><td>true/false</td><td>' + t('schemaSoldByBox') + '</td></tr>' +
      '<tr><td>box_units</td><td>number</td><td>' + t('schemaBoxUnits') + '</td></tr>' +
      '<tr><td>box_purchase_price</td><td>number</td><td>' + t('schemaBoxPurchasePrice') + '</td></tr>' +
      '<tr><td>box_sale_price</td><td>number</td><td>' + t('schemaBoxSalePrice') + '</td></tr>';
  }

  titleModal: {
    el = $sel('#modal h3'); if (el) el.textContent = t('renameStore');
    placehold(modalInput, 'enterStoreName');
    setText('modalSave', 'save');
    setText('modalCancel', 'cancel');
  }

  projectsModal: {
    var h3 = $sel('#newProjectOverlay h3');
    if (h3) h3.textContent = t('dbManagerTitle');

    var desc = $sel('#dbManagerTitle + p, #newProjectOverlay .modal-desc:first-of-type');
    if (desc) desc.innerHTML = t('currentProject') + ' <strong id="currentProjectName">' + (currentDbName || '') + '</strong>';

    placehold('newProjectInput', 'newProjectPlaceholder');
    setText('newProjectCancel', 'cancel');

    var listEmpty = $id('dbListEmpty');
    if (listEmpty) listEmpty.textContent = t('dbListEmptyText');

    setText('modalImportBtn', 'importExcelModal');
  }

  inventoryPanel: {
    el = $sel('.panel-table h2'); if (el) el.textContent = t('products');
    placehold('searchInput', 'searchPlaceholder');
    placehold('name', 'namePlaceholder');
    placehold('barcode', 'barcodePlaceholder');
    placehold('explorerSearch', 'explorerSearch');
  }

  restockPanel: {
    var restockH2 = $sel('#tab-restock h2');
    if (restockH2) restockH2.textContent = t('restockTitle');
    var restockBadge = $id('restockThresholdBadge');
    if (restockBadge) restockBadge.textContent = t('restockThreshold');
    var restockEmpty = $id('restockEmpty');
    if (restockEmpty) restockEmpty.textContent = t('restockEmpty');
  }

  if (langToggleBtn) langToggleBtn.textContent = lang === 'en' ? 'ES' : 'EN';

  translateDeleteModal();
}

// ---- INIT ----
(function init() {
  lang = localStorage.getItem('lang') || 'en';
  currentDbName = localStorage.getItem('dbName') || '';
  loadTitle();
  updateDbNameLabel();
  updateCategoryOptions();
  translateAllUI();
  rebuildTableHead();
  loadFromDB();
})();
