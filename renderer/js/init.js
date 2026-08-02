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
  renderCart();
})();
