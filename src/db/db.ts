import Dexie, { type Table } from 'dexie';

export interface Product {
    id?: number;
    name: string;
    brand?: string;
    content?: string;
    category?: string;
    basePrice: number;
    image?: string; // Base64 string
}

export interface PurchaseItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}

export interface Purchase {
    id?: number;
    date: Date;
    storeName: string;
    items: PurchaseItem[];
    subtotal: number;
    discount: number;
    total: number;
}

import { seedProducts } from '../data/seedProducts';

export class AppDatabase extends Dexie {
    products!: Table<Product>;
    purchases!: Table<Purchase>;

    constructor() {
        super('GroceryDB');
        this.version(1).stores({
            products: '++id, name',
            purchases: '++id, date, storeName'
        });

        this.on('populate', () => {
            this.products.bulkAdd(seedProducts);
        });
    }
}

export const db = new AppDatabase();

import { detectCategory } from '../utils/categoryHelper';

export async function checkAndSeed() {
    const count = await db.products.count();
    if (count === 0) {
        console.log('Seeding database with imported products...');
        // Pre-calculate categories for seed data
        const seededWithCats = seedProducts.map(p => ({
            ...p,
            category: detectCategory(p.name)
        }));
        await db.products.bulkAdd(seededWithCats);
        console.log('Seeding complete.');
    } else {
        // Migration: Check if any product is missing category
        const missingCategory = await db.products.filter(p => !p.category).count();
        if (missingCategory > 0) {
            console.log('Migrating categories...');
            const allProducts = await db.products.toArray();
            const updates = allProducts
                .filter(p => !p.category)
                .map(p => db.products.update(p.id!, { category: detectCategory(p.name) }));

            await Promise.all(updates);
            console.log('Category migration complete.');
        }
    }
}
