import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Product } from '../db/db';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '../utils/categoryHelper';
import './ProductList.css';

interface ProductListProps {
    onEdit: (product: Product) => void;
    onAdd: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onEdit, onAdd }) => {
    const [search, setSearch] = useState('');

    const products = useLiveQuery(
        () => {
            if (!search) return db.products.toArray();
            return db.products
                .where('name')
                .startsWithIgnoreCase(search)
                .toArray();
        },
        [search]
    );

    const handleDelete = async (id?: number) => {
        if (id && confirm('¿Estás seguro de eliminar este producto?')) {
            await db.products.delete(id);
        }
    };

    return (
        <div className="product-list-container">
            <div className="search-bar card">
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <button className="fab-add-button" onClick={onAdd} aria-label="Agregar Producto">
                <Plus size={32} />
            </button>

            <div className="product-list">
                {!products ? (
                    <p className="loading-text">Cargando...</p>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay productos registrados.</p>
                        <button className="btn-primary" onClick={onAdd}>Agregar el primero</button>
                    </div>
                ) : (
                    products
                        .sort((a, b) => (a.category || '').localeCompare(b.category || '') || a.name.localeCompare(b.name))
                        .map((product) => {
                            const Icon = getCategoryIcon(product.category || '');
                            const bgColor = getCategoryColor(product.category || '');
                            const textColor = getCategoryTextColor(product.category || '');

                            return (
                                <div key={product.id} className="product-item card">
                                    {/* Left: Sticker Image */}
                                    <div className="product-thumbnail" style={{ backgroundColor: bgColor }}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <Icon size={32} color={textColor} strokeWidth={1.5} />
                                        )}
                                    </div>

                                    {/* Center: Info */}
                                    <div className="product-info">
                                        <div className="product-name-block">
                                            <span className="product-title">{product.name}</span>
                                            <span className="product-details">
                                                {product.brand} {product.content && `• ${product.content}`}
                                            </span>
                                        </div>
                                        <div className="category-badge">
                                            {product.category || 'Otros'}
                                        </div>
                                    </div>

                                    {/* Right: Price & Actions */}
                                    <div className="product-price-block">
                                        <span className="price-tag">${product.basePrice.toFixed(0)}</span>
                                        <div className="product-actions">
                                            <button onClick={() => onEdit(product)} className="btn-icon-sm edit" aria-label="Editar">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="btn-icon-sm delete" aria-label="Eliminar">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
};
