// ---- RESTOCK ----
var LOW_STOCK_THRESHOLD = 5;

function renderRestock() {
  var grid = $id('restockGrid');
  var emptyEl = $id('restockEmpty');
  if (!grid) return;

  var lowStock = products.filter(function (p) { return Number(p.stock) <= LOW_STOCK_THRESHOLD; });

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
        '<div class="restock-card-footer"><span class="id-tag">#' + p.id + '</span></div>' +
      '</div>';
  });

  grid.innerHTML = html;
}
