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
  cart = [];
  refreshProductViews();

  var explorerResultsEl = $id('explorerResults');
  if (explorerResultsEl) {
    explorerResultsEl.innerHTML = '<div class="explorer-empty">' + t('explorerEmpty') + '</div>';
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
    cart = [];
    updateDbNameLabel();
    resetForm();
    refreshProductViews();
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
