# xls--visualapp (Pape)

Aplicación de escritorio (Electron) para gestionar el inventario de una papelería/tienda de artículos escolares y de oficina, usando **Excel (.xlsx) como base de datos**. Permite agregar, buscar, editar y eliminar productos, detectar duplicados por código de barras, y ver alertas de bajo stock — todo desde una interfaz visual sin tocar el Excel directamente.

## Características

- **Explorador**: busca o escanea un producto para ver su precio al instante.
- **Inventario**: alta, edición y baja de productos (nombre, categoría, precio de compra/venta, stock, venta por caja).
- **Autocompletado por código de barras**: al escribir un código de barras existente, el formulario se llena automáticamente (nombre, categoría, precios, stock, ganancia) para evitar productos duplicados durante la captura de inventario.
- **Restock**: lista de productos con stock bajo (≤ 5 unidades) para saber qué reabastecer.
- **Multi-proyecto**: crea y cambia entre varias "bases de datos" (archivos `.xlsx` independientes) desde la app.
- **Importar / Exportar** archivos Excel.
- **Bilingüe**: interfaz en español e inglés (botón ES/EN).

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm

## Instalación

```bash
git clone https://github.com/JairEsk/xls--visualapp.git
cd xls--visualapp
npm install
```

## Uso

```bash
npm start
```

Esto abre la aplicación de escritorio (Electron). Al iniciar por primera vez, se crea automáticamente un archivo `data/products.xlsx` que actúa como base de datos.

## Estructura del proyecto

```
├── main.js              # Proceso principal de Electron (ventana, IPC, diálogos)
├── preload.js           # Puente seguro entre el proceso principal y el renderer
├── database.js          # Lectura/escritura del Excel (capa de "base de datos")
├── renderer/
│   ├── index.html       # Interfaz (pestañas: Explorador, Inventario, Restock, Ayuda)
│   ├── renderer.js       # Lógica de UI, i18n, tabla, formulario, autocompletado
│   └── styles.css        # Estilos
├── data/                 # Archivos .xlsx generados en tiempo de ejecución (ignorados por git)
└── package.json
```

## Formato del Excel

Si prefieres preparar un archivo Excel manualmente en lugar de usar el formulario de la app, debe tener estas columnas (ver también la pestaña **Ayuda** dentro de la app):

| Columna              | Tipo        | Descripción                          |
|----------------------|-------------|---------------------------------------|
| `id`                 | texto       | Identificador único del producto      |
| `barcode`            | texto       | Código de barras (UPC/EAN)            |
| `name`               | texto       | Nombre del producto                   |
| `category`           | texto       | Categoría                             |
| `purchase_price`     | número      | Precio de compra por unidad           |
| `sale_price`         | número      | Precio de venta por unidad            |
| `stock`              | número      | Unidades en inventario                |
| `sold_by_box`        | true/false  | Si también se vende por caja          |
| `box_units`          | número      | Unidades por caja                     |
| `box_purchase_price` | número      | Precio de compra de la caja           |
| `box_sale_price`     | número      | Precio de venta de la caja            |

## Empaquetado (build)

Este proyecto todavía no incluye configuración de empaquetado (por ejemplo, `electron-builder`). Para generar un instalador, se recomienda agregar una herramienta como [electron-builder](https://www.electron.build/) o [electron-forge](https://www.electronforge.io/).

## Licencia

MIT
