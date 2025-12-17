const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_FILE = path.resolve(__dirname, '../compras_normalizado.xlsx');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/seedProducts.ts');

// Create src/data if it doesn't exist
const dataDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`Reading from: ${EXCEL_FILE}`);

try {
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows.`);

    const uniqueProducts = new Map();

    data.forEach(row => {
        // Normalizing data
        const producto = (row.producto || row.Producto || '').trim();
        const marca = (row.marca || row.Marca || '').trim();
        const contenido = (row.contenido || row.Contenido || '').trim();
        const precio = parseFloat(row.precio_unitario || row.Precio || 0);

        if (!producto) return;

        // Unique key for deduplication: Name + Brand + Content
        // Using lowercase for key comparison to avoid case-sensitive duplicates
        const key = `${producto.toLowerCase()}|${marca.toLowerCase()}|${contenido.toLowerCase()}`;

        if (!uniqueProducts.has(key)) {
            uniqueProducts.set(key, {
                name: producto,
                brand: marca,
                content: contenido,
                basePrice: precio,
                image: '' // Default empty image
            });
        } else {
            // Optional: Update price if newer? 
            // For now we just keep the first occurrence or maybe max price?
            // Let's keep the existing logic simple: first one wins, or we update price if current is 0
            const existing = uniqueProducts.get(key);
            if (existing.basePrice === 0 && precio > 0) {
                existing.basePrice = precio;
            }
        }
    });

    const productList = Array.from(uniqueProducts.values());

    console.log(`Processed ${productList.length} unique products.`);

    const fileContent = `import type { Product } from '../db/db';

export const seedProducts: Omit<Product, 'id'>[] = ${JSON.stringify(productList, null, 4)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Successfully wrote seed data to: ${OUTPUT_FILE}`);

} catch (error) {
    console.error('Error processing Excel file:', error);
    process.exit(1);
}
