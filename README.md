# xls--visualapp (Pape) 📊

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-191970?style=flat&logo=Electron&logoColor=white)](https://www.electronjs.org/)

Desktop application (Electron) for managing inventory of a stationery/office-supply store, using **Excel (.xlsx) as the database**. It lets you add, search, edit, and delete products, detect duplicates by barcode, and see low-stock alerts — all from a visual UI without touching the Excel file directly.

## ✨ Features

- **Explorer**: search or scan a product to see its price instantly.
- **Inventory**: add, edit, and remove products (name, category, purchase/sale price, stock, sold by box).
- **Barcode autofill**: typing an existing barcode automatically fills the form (name, category, prices, stock, profit) to prevent duplicate products during inventory entry.
- **Restock**: list of low-stock products (≤ 5 units) so you know what needs restocking.
- **Multi-project**: create and switch between several "databases" (independent `.xlsx` files) from the app.
- **Import / Export**: easily backup or load Excel files.
- **Bilingual**: UI available in English and Spanish (ES/EN toggle).

## 🚀 Requirements

- [Node.js](https://nodejs.org/) 18 or higher
- npm

## 🛠️ Installation

```bash
git clone https://github.com/JairEsk/xls--visualapp.git
cd xls--visualapp
npm install
```

## 💻 Usage

```bash
npm start
```

This launches the desktop app (Electron). On the first run, a `data/products.xlsx` file is created automatically and acts as the database.

## 📂 Project structure

```text
├── main.js              # Electron main process (window, IPC, dialogs)
├── preload.js           # Secure bridge between main process and renderer
├── database.js          # Excel read/write ("database" layer)
├── renderer/
│   ├── index.html       # UI (tabs: Explorer, Inventory, Restock, Help)
│   ├── renderer.js      # UI logic, i18n, table, form, autofill
│   └── styles.css       # Styles
├── data/                # Runtime-generated .xlsx files (git-ignored)
└── package.json
```

## 📊 Excel format

If you prefer to prepare an Excel file manually instead of using the app's form, it must have these columns (also shown in the **Help** tab inside the app):

| Column               | Type        | Description                        |
|-----------------------|-------------|--------------------------------------|
| `id`                 | text        | Unique product identifier            |
| `barcode`            | text        | Product barcode (UPC/EAN)            |
| `name`               | text        | Product name                         |
| `category`           | text        | Category                             |
| `purchase_price`     | number      | Unit purchase price                  |
| `sale_price`         | number      | Unit sale price                      |
| `stock`              | number      | Units in inventory                   |
| `sold_by_box`        | true/false  | Whether also sold by box             |
| `box_units`          | number      | Units per box                        |
| `box_purchase_price` | number      | Box purchase price                   |
| `box_sale_price`     | number      | Box sale price                       |

## 📦 Packaging (build)

This project doesn't yet include packaging configuration (e.g. `electron-builder`). To generate an installer, consider adding a tool such as [electron-builder](https://www.electron.build/) or [electron-forge](https://www.electronforge.io/).

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. 

## 📄 License

MIT
