import * as XLSX from 'xlsx';
import type { Purchase } from '../db/db';

export interface ExportRow {
    Fecha: string;
    Producto: string;
    Cantidad: number;
    Precio: number;
    Total: number;
}

/**
 * Filters purchases by month and year
 */
export function filterPurchasesByMonth(purchases: Purchase[], year: number, month: number): Purchase[] {
    return purchases.filter(p => {
        const date = new Date(p.date);
        return date.getFullYear() === year && date.getMonth() === month;
    });
}

/**
 * Converts purchases to flat rows for Excel export
 */
export function convertPurchasesToRows(purchases: Purchase[]): ExportRow[] {
    const rows: ExportRow[] = [];

    for (const purchase of purchases) {
        for (const item of purchase.items) {
            rows.push({
                Fecha: new Date(purchase.date).toLocaleDateString('es-AR'),
                Producto: item.productName,
                Cantidad: item.quantity,
                Precio: item.price,
                Total: item.quantity * item.price
            });
        }
    }

    return rows;
}

/**
 * Exports purchases to Excel file
 */
export function exportToExcel(purchases: Purchase[], year: number, month: number): void {
    const filtered = filterPurchasesByMonth(purchases, year, month);
    const rows = convertPurchasesToRows(filtered);

    if (rows.length === 0) {
        alert('No hay compras para el mes seleccionado.');
        return;
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');

    // Column widths
    worksheet['!cols'] = [
        { wch: 12 }, // Fecha
        { wch: 30 }, // Producto
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Precio
        { wch: 12 }, // Total
    ];

    // Generate filename
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const fileName = `compras_${monthNames[month]}_${year}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fileName);
}

/**
 * Gets available months from purchases list
 */
export function getAvailableMonths(purchases: Purchase[]): { year: number; month: number; label: string }[] {
    const monthSet = new Set<string>();
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    for (const purchase of purchases) {
        const date = new Date(purchase.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthSet.add(key);
    }

    return Array.from(monthSet)
        .map(key => {
            const [year, month] = key.split('-').map(Number);
            return {
                year,
                month,
                label: `${monthNames[month]} ${year}`
            };
        })
        .sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            return b.month - a.month;
        });
}
