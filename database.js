const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

const HEADERS = [
  'id', 'barcode', 'name', 'category', 'purchase_price', 'sale_price',
  'stock', 'sold_by_box', 'box_units',
  'box_purchase_price', 'box_sale_price'
];

function getDbPath(dbName) {
  var safe = (dbName || 'products').replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') || 'products';
  return path.join(DATA_DIR, safe + '.xlsx');
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function createEmptyWorkbook(dbPath) {
  var dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet([], { header: HEADERS });
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, dbPath);
  return true;
}

function loadProducts(dbName) {
  var dbPath = getDbPath(dbName);
  ensureDataDir();
  if (!fs.existsSync(dbPath)) {
    createEmptyWorkbook(dbPath);
    return [];
  }
  var workbook = XLSX.readFile(dbPath);
  var sheet = workbook.Sheets[workbook.SheetNames[0]];
  var rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return rows.map(function(r, i) {
    return {
      id: (r.id !== undefined && r.id !== '') ? String(r.id) : String(i + 1),
      barcode: (r.barcode !== undefined && r.barcode !== null) ? String(r.barcode).trim() : '',
      name: r.name || '',
      category: r.category || '',
      purchasePrice: Number(r.purchase_price) || 0,
      salePrice: Number(r.sale_price) || 0,
      stock: Number(r.stock) || 0,
      soldByBox: r.sold_by_box === true || r.sold_by_box === 'true' || r.sold_by_box === 1 || r.sold_by_box === '1',
      boxUnits: Number(r.box_units) || 0,
      boxPurchasePrice: Number(r.box_purchase_price) || 0,
      boxSalePrice: Number(r.box_sale_price) || 0
    };
  });
}

function saveProducts(products, dbName) {
  var dbPath = getDbPath(dbName);
  var dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  var data = products.map(function(p, i) {
    return {
      id: (p.id !== undefined && p.id !== '') ? String(p.id) : String(i + 1),
      barcode: (p.barcode !== undefined && p.barcode !== null) ? String(p.barcode).trim() : '',
      name: p.name || '',
      category: p.category || '',
      purchase_price: Number(p.purchasePrice) || 0,
      sale_price: Number(p.salePrice) || 0,
      stock: Number(p.stock) || 0,
      sold_by_box: p.soldByBox ? 'true' : 'false',
      box_units: Number(p.boxUnits) || 0,
      box_purchase_price: Number(p.boxPurchasePrice) || 0,
      box_sale_price: Number(p.boxSalePrice) || 0
    };
  });
  var ws = XLSX.utils.json_to_sheet(data, { header: HEADERS });
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, dbPath);
  return true;
}

module.exports = { loadProducts, saveProducts, HEADERS, getDbPath };
