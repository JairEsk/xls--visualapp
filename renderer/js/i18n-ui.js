// ---- LANGUAGE ----
var langToggleBtn = $id('langToggleBtn');

function switchLanguage(newLang) {
  lang = newLang;
  localStorage.setItem('lang', lang);
  updateCategoryOptions();
  translateAllUI();
  rebuildTableHead();
  renderTable();
  renderCart();
  updateDbNameLabel();
  var explorerSearchEl = $id('explorerSearch');
  if (explorerSearchEl && explorerSearchEl.value) refreshExplorerFromSearch();
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', function () {
    switchLanguage(lang === 'en' ? 'es' : 'en');
  });
}

// ---- TRANSLATE ALL UI ----
function translateAllUI() {
  document.title = t('title');
  loadTitle();
  setText('tabExplorerBtn',  'tabExplorer');
  setText('tabInventoryBtn', 'tabInventory');
  setText('tabRestockText',  'tabRestock');
  setText('tabHelpBtn',      'tabHelp');
  setText('btnNew',          'newProject');
  setText('btnExport',       'exportExcel');

  var editingInput = $id('editingId');
  var isEditing = editingInput && editingInput.value;
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
    placehold('modalInput', 'enterStoreName');
    setText('modalSave', 'save');
    setText('modalCancel', 'cancel');
  }

  projectsModal: {
    setText('newProjectModalTitle', 'newProjectTitle');
    setText('newProjectDescText', 'newProjectDesc');
    placehold('newProjectInput', 'newProjectPlaceholder');
    setText('newProjectCancel', 'cancel');

    setText('dbManagerTitle', 'dbManagerTitle');
    var desc = $id('currentProjectLabel');
    if (desc) desc.innerHTML = t('currentProject') + ' <strong id="currentProjectName">' + escapeHtml(currentDbName || '') + '</strong>';

    var listEmpty = $id('dbListEmpty');
    if (listEmpty) listEmpty.textContent = t('dbListEmptyText');

    setText('modalImportBtn', 'importExcelModal');
    setText('projectsClose', 'close');
  }

  saleConfirmModal: {
    setText('saleConfirmTitle', 'saleConfirmTitle');
    setText('saleConfirmDesc', 'saleConfirmDesc');
    setText('lblConfirmTotal', 'lblConfirmTotal');
    setText('lblCashReceived', 'lblCashReceived');
    setText('lblChangeDue', 'lblChangeDue');
    setText('saleConfirmBtn', 'saleConfirmBtn');
    setText('saleCancelBtn', 'cancel');
  }

  inventoryPanel: {
    el = $sel('.panel-table h2'); if (el) el.textContent = t('products');
    placehold('searchInput', 'searchPlaceholder');
    placehold('name', 'namePlaceholder');
    placehold('barcode', 'barcodePlaceholder');
    placehold('explorerSearch', 'explorerSearch');
  }

  posCart: {
    setText('cartTitle', 'cartTitle');
    setText('cartTotalLabel', 'cartTotalLabel');
    setText('btnCompleteSale', 'completeSale');
    setText('btnCancelSale', 'cancelSale');

    var cartEmptyMsg = $id('cartEmptyMsg');
    if (cartEmptyMsg && cart.length === 0) cartEmptyMsg.textContent = t('cartEmptyText');
  }

  restockPanel: {
    var restockH2 = $sel('#tab-restock h2');
    if (restockH2) restockH2.textContent = t('restockTitle');
    var restockBadge = $id('restockThresholdBadge');
    if (restockBadge) restockBadge.textContent = t('restockThreshold');
    var restockEmpty = $id('restockEmpty');
    if (restockEmpty) restockEmpty.textContent = t('restockEmpty');
  }

  var langToggleEl = $id('langToggleBtn');
  if (langToggleEl) langToggleEl.textContent = lang === 'en' ? 'ES' : 'EN';

  translateDeleteModal();
}
