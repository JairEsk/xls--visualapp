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
    restockUnitsLeft: function (n) { return n + ' left'; },
    addToCartBtn: 'Add',
    cartTitle: 'Sale',
    cartEmptyText: 'No items in cart',
    cartTotalLabel: 'Total',
    completeSale: 'Complete Sale',
    cancelSale: 'Cancel',
    saleCompleted: 'Sale completed.',
    saleCancelled: 'Sale cancelled.',
    insufficientStock: 'Insufficient stock for',
    cartItems: function (n) { return n + ' item' + (n !== 1 ? 's' : ''); }
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
    restockUnitsLeft: function (n) { return n + ' restantes'; },
    addToCartBtn: 'Agregar',
    cartTitle: 'Venta',
    cartEmptyText: 'Sin productos en la venta',
    cartTotalLabel: 'Total',
    completeSale: 'Completar Venta',
    cancelSale: 'Cancelar',
    saleCompleted: 'Venta completada.',
    saleCancelled: 'Venta cancelada.',
    insufficientStock: 'Stock insuficiente para',
    cartItems: function (n) { return n + ' producto' + (n !== 1 ? 's' : ''); }
  }
};

// ---- APPLICATION STATE ----
var products = [];
var cart = [];
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
  var toastEl = $id('toast');
  if (!toastEl) return;
  type = type || 'info';
  toastEl.textContent = message;
  toastEl.className = 'toast show toast-' + type;
  clearTimeout(toastEl._timeout);
  toastEl._timeout = setTimeout(function () { toastEl.className = 'toast hidden'; }, 2500);
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
  try { products = await window.api.getProducts(currentDbName); refreshProductViews(); }
  catch (err) { console.error(err); showToast(t('dbLoadError'), 'error'); }
}

async function saveToDB() {
  if (!apiAvailable()) return;
  try { await window.api.saveProducts(products, currentDbName); }
  catch (err) { console.error(err); showToast(t('dbSaveError'), 'error'); }
}

// ---- OPTIONAL MODULE FALLBACKS ----
// Feature modules override these functions when their script is loaded.
function renderTable() {}
function rebuildTableHead() {}
function renderRestock() {}
function renderCart() {}
function refreshExplorerFromSearch() {}
function updateCategoryOptions() {}
function translateAllUI() {}
function translateDeleteModal() {}
function loadTitle() {}
function updateDbNameLabel() {}
function updateHelpDbName() {}
function resetForm() {}

function refreshProductViews() {
  renderTable();
  renderRestock();
  renderCart();
  refreshExplorerFromSearch();
}
