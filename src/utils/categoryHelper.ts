
// Helper for detecting categories based on product name
import { Milk, Waves, ShoppingBasket, Beef, SprayCan, Utensils } from 'lucide-react';

export const CATEGORIES = {
    LACTEOS: 'Lácteos',
    BEBIDAS: 'Bebidas',
    ALMACEN: 'Almacén',
    LIMPIEZA: 'Limpieza',
    FRESCOS: 'Frescos',
    OTROS: 'Otros'
};

export const detectCategory = (name: string): string => {
    const n = name.toLowerCase();

    if (n.includes('leche') || n.includes('yogur') || n.includes('queso') || n.includes('manteca') || n.includes('crema')) return CATEGORIES.LACTEOS;
    if (n.includes('gaseosa') || n.includes('agua') || n.includes('vino') || n.includes('cerveza') || n.includes('jugo')) return CATEGORIES.BEBIDAS;
    if (n.includes('arroz') || n.includes('fideos') || n.includes('harina') || n.includes('aceite') || n.includes('azucar') || n.includes('yerba') || n.includes('cafe') || n.includes('galletitas') || n.includes('pan')) return CATEGORIES.ALMACEN;
    if (n.includes('detergente') || n.includes('lavandina') || n.includes('jabon') || n.includes('papel') || n.includes('shampoo')) return CATEGORIES.LIMPIEZA;
    if (n.includes('carne') || n.includes('pollo') || n.includes('fruta') || n.includes('verdura') || n.includes('huevo')) return CATEGORIES.FRESCOS;

    return CATEGORIES.OTROS;
};

export const getCategoryIcon = (category: string) => {
    switch (category) {
        case CATEGORIES.LACTEOS: return Milk;
        case CATEGORIES.BEBIDAS: return Waves; // Water/Liquid like
        case CATEGORIES.ALMACEN: return ShoppingBasket;
        case CATEGORIES.LIMPIEZA: return SprayCan;
        case CATEGORIES.FRESCOS: return Beef; // Or Apple if available
        default: return Utensils;
    }
};

export const getCategoryColor = (category: string): string => {
    switch (category) {
        case CATEGORIES.LACTEOS: return '#e3f2fd'; // Light Blue
        case CATEGORIES.BEBIDAS: return '#e0f7fa'; // Cyan
        case CATEGORIES.ALMACEN: return '#fff3e0'; // Orange
        case CATEGORIES.LIMPIEZA: return '#f3e5f5'; // Purple
        case CATEGORIES.FRESCOS: return '#e8f5e9'; // Green
        default: return '#f5f5f5'; // Gray
    }
};

export const getCategoryTextColor = (category: string): string => {
    switch (category) {
        case CATEGORIES.LACTEOS: return '#1565c0';
        case CATEGORIES.BEBIDAS: return '#006064';
        case CATEGORIES.ALMACEN: return '#e65100';
        case CATEGORIES.LIMPIEZA: return '#6a1b9a';
        case CATEGORIES.FRESCOS: return '#1b5e20';
        default: return '#616161';
    }
};
