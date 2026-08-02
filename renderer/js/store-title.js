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
