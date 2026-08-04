// ---- SALES LEDGER / ADMIN VIEW ----
function renderSalesHistory() {
  var tbody = $id('salesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  var countVal = $id('salesCountVal');
  var revenueVal = $id('salesRevenueVal');
  var avgVal = $id('salesAvgVal');

  if (!sales || sales.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7" id="salesEmptyText" style="text-align: center; color: var(--text-muted); padding: 40px;">' + t('salesEmpty') + '</td></tr>';
    if (countVal) countVal.textContent = '0';
    if (revenueVal) revenueVal.textContent = formatCurrency(0);
    if (avgVal) avgVal.textContent = formatCurrency(0);
    return;
  }

  var totalRevenue = 0;
  var html = '';

  // Show latest sales first (reverse chronological order)
  var reversedSales = sales.slice().reverse();

  reversedSales.forEach(function (s) {
    totalRevenue += Number(s.total) || 0;

    var methodClass = s.paymentMethod === 'Card' || s.paymentMethod === 'Tarjeta' ? 'badge-box' : 'badge-no';

    html +=
      '<tr>' +
        '<td>' + escapeHtml(s.date) + '</td>' +
        '<td>' + (Number(s.itemsCount) || 0) + '</td>' +
        '<td style="white-space: normal; max-width: 320px; font-size: 12px; color: var(--text-secondary);">' + escapeHtml(s.details) + '</td>' +
        '<td>' + formatCurrency(s.received) + '</td>' +
        '<td>' + formatCurrency(s.change) + '</td>' +
        '<td><span class="badge ' + methodClass + '">' + escapeHtml(s.paymentMethod) + '</span></td>' +
        '<td style="font-weight: 700; color: var(--primary);">' + formatCurrency(s.total) + '</td>' +
      '</tr>';
  });

  tbody.innerHTML = html;

  if (countVal) countVal.textContent = sales.length;
  if (revenueVal) revenueVal.textContent = formatCurrency(totalRevenue);
  if (avgVal) avgVal.textContent = formatCurrency(totalRevenue / sales.length);
}

// Override function in app-core to refresh sales history
(function overrideRefresh() {
  var oldRefresh = refreshProductViews;
  refreshProductViews = function() {
    if (typeof oldRefresh === 'function') oldRefresh();
    renderSalesHistory();
  };
})();
