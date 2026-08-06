// ---- RESTOCK ----
var LOW_STOCK_THRESHOLD = 5;

function renderRestock() {
  var grid = $id('restockGrid');
  var emptyEl = $id('restockEmpty');
  if (!grid) return;

  var lowStock = products.filter(function (p) { return Number(p.stock) <= LOW_STOCK_THRESHOLD; });

  var headerBadge = $id('adminHeaderBadge');
  if (headerBadge) {
    if (lowStock.length > 0) {
      headerBadge.textContent = lowStock.length;
      headerBadge.classList.remove('hidden');
    } else {
      headerBadge.classList.add('hidden');
    }
  }
  var badge = $id('restockTabBadge');
  if (badge) {
    if (lowStock.length > 0) {
      badge.textContent = lowStock.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

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
        '<div class="restock-card-footer" style="display: flex; justify-content: space-between; align-items: center;">' +
          '<span class="id-tag">#' + p.id + '</span>' +
          '<div class="restock-quick-add">' +
            '<input type="number" class="restock-quick-input" id="restockInput_' + p.id + '" value="10" min="1" step="1">' +
            '<button class="btn-quick-restock" data-id="' + p.id + '" title="Restock">ðŸ“¥</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  grid.innerHTML = html;

  // Bind quick restock click listeners
  var restockBtns = grid.querySelectorAll('.btn-quick-restock');
  restockBtns.forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var id = btn.getAttribute('data-id');
      var inputEl = $id('restockInput_' + id);
      if (!inputEl) return;
      
      var addAmount = parseInt(inputEl.value);
      if (isNaN(addAmount) || addAmount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
      }
      if (addAmount > 10000) {
        showToast('Maximum restock amount is 10,000 units', 'error');
        return;
      }
      
      var prod = findProduct(id);
      if (prod) {
        prod.stock = Math.min(100000, (Number(prod.stock) || 0) + addAmount);
        try {
          await saveToDB();
          showToast(t('productUpdated'), 'success');
          refreshProductViews();
        } catch (err) {
          console.error(err);
          showToast(t('dbSaveError'), 'error');
        }
      }
    });
  });

  // Handle enter key in the inputs
  var restockInputs = grid.querySelectorAll('.restock-quick-input');
  restockInputs.forEach(function (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var id = input.id.replace('restockInput_', '');
        var btn = grid.querySelector('.btn-quick-restock[data-id="' + id + '"]');
        if (btn) btn.click();
      }
    });
  });
}
