// ---- STORE TITLE & CONFIGS ----
var storeTitle    = $id('storeTitle');
var editTitleBtn  = $id('editTitleBtn');
var modalOverlay  = $id('modalOverlay');
var modalInput    = $id('modalInput');
var modalSave     = $id('modalSave');
var modalCancel   = $id('modalCancel');

function loadTitle() {
  var s = localStorage.getItem('storeTitle');
  if (s === 'Stationery Manager' || s === 'Gestor de Papelería' || s === 'Papelería') {
    localStorage.removeItem('storeTitle');
    s = null;
  }
  var currentTitle = s || t('title');
  if (storeTitle) storeTitle.textContent = currentTitle;
  document.title = currentTitle;

  var cfgInput = $id('cfgStoreNameInput');
  if (cfgInput) cfgInput.value = currentTitle;
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

// Config Panel store title save
var btnSaveStoreName = $id('btnSaveStoreName');
if (btnSaveStoreName) {
  btnSaveStoreName.addEventListener('click', function () {
    var cfgInput = $id('cfgStoreNameInput');
    var v = cfgInput ? cfgInput.value.trim() : '';
    if (v) {
      saveTitle(v);
      showToast(t('configsSaved'), 'success');
    }
  });
}

function darkenHex(hex, percent) {
  var r = parseInt(hex.substring(1, 3), 16);
  var g = parseInt(hex.substring(3, 5), 16);
  var b = parseInt(hex.substring(5, 7), 16);

  var rd = Math.max(0, Math.floor(r * (1 - percent)));
  var gd = Math.max(0, Math.floor(g * (1 - percent)));
  var bd = Math.max(0, Math.floor(b * (1 - percent)));

  return '#' +
    rd.toString(16).padStart(2, '0') +
    gd.toString(16).padStart(2, '0') +
    bd.toString(16).padStart(2, '0');
}

// ---- THEME COLOR CUSTOMIZATION ----
function applyThemeColor(hex) {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
    hex = '#2f6f62'; // Default
  }

  var r = parseInt(hex.substring(1, 3), 16);
  var g = parseInt(hex.substring(3, 5), 16);
  var b = parseInt(hex.substring(5, 7), 16);

  // Darken by 15% for hover
  var rh = Math.max(0, Math.floor(r * 0.85));
  var gh = Math.max(0, Math.floor(g * 0.85));
  var bh = Math.max(0, Math.floor(b * 0.85));
  var hoverHex = '#' +
    rh.toString(16).padStart(2, '0') +
    gh.toString(16).padStart(2, '0') +
    bh.toString(16).padStart(2, '0');

  var root = document.documentElement;
  root.style.setProperty('--primary', hex);
  root.style.setProperty('--primary-hover', hoverHex);
  root.style.setProperty('--primary-light', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.10)');
  root.style.setProperty('--primary-border', 'rgba(' + r + ', ' + g + ', ' + b + ', 0.24)');

  var headerBgTop = darkenHex(hex, 0.15);
  var headerBg    = darkenHex(hex, 0.25);
  root.style.setProperty('--header-bg-top', headerBgTop);
  root.style.setProperty('--header-bg', headerBg);

  localStorage.setItem('themeColor', hex);

  // Highlight active preset button
  var presetBtns = document.querySelectorAll('.color-preset-btn');
  presetBtns.forEach(function (btn) {
    if (btn.dataset.color.toLowerCase() === hex.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  var picker = $id('cfgThemeColorPicker');
  if (picker && picker.value.toLowerCase() !== hex.toLowerCase()) {
    picker.value = hex;
  }
}

// Initialize theme color
(function initTheme() {
  var savedColor = localStorage.getItem('themeColor') || '#2f6f62';
  applyThemeColor(savedColor);
})();

// Preset theme button clicks
document.querySelectorAll('.color-preset-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    applyThemeColor(btn.dataset.color);
  });
});

// Color picker change event
var themeColorPicker = $id('cfgThemeColorPicker');
if (themeColorPicker) {
  themeColorPicker.addEventListener('input', function () {
    applyThemeColor(themeColorPicker.value);
  });
}
