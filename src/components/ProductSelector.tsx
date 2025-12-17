import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Product } from '../db/db';
import { Search, Plus } from 'lucide-react';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '../utils/categoryHelper';
import './ProductList.css'; // Reusing styles

interface ProductSelectorProps {
    onSelect: (product: Product) => void;
    onCancel: () => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect, onCancel }) => {
    const [search, setSearch] = useState('');

    const products = useLiveQuery(
        () => {
            const q = search.trim().toLowerCase();
            if (!q) return db.products.toArray();

            return db.products.filter(p => {
                const nameMatch = p.name.toLowerCase().includes(q);
                const brandMatch = p.brand?.toLowerCase().includes(q) || false;
                const contentMatch = p.content?.toLowerCase().includes(q) || false;
                return nameMatch || brandMatch || contentMatch;
            }).toArray();
        },
        [search]
    );

    const handleManualCreate = () => {
        onSelect({
            name: search,
            basePrice: 0,
            brand: '', // Optional: could parse from search string but keep simple
            content: ''
        } as Product);
    };

    return (
        <div className="product-list-container selector">
            <div className="search-bar card">
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar o escribir nuevo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>
                <button className="btn-secondary" onClick={onCancel} style={{ width: 'auto', padding: '0 1rem', height: '48px', borderRadius: '12px' }}>
                    Cancelar
                </button>
            </div>

            <div className="product-list">
                {/* Manual Create Option */}
                {search && (
                    <div
                        className="product-item card create-new"
                        onClick={handleManualCreate}
                        style={{ cursor: 'pointer', border: '1px dashed var(--primary)' }}
                    >
                        <div className="product-thumbnail" style={{ backgroundColor: 'var(--color-bg)' }}>
                            <Plus size={32} className="text-primary" />
                        </div>
                        <div className="product-info">
                            <span className="product-title">Crear "{search}"</span>
                            <span className="product-details">Producto nuevo (manual)</span>
                        </div>
                    </div>
                )}

                {products?.map((product) => {
                    const Icon = getCategoryIcon(product.category || '');
                    const bgColor = getCategoryColor(product.category || '');
                    const textColor = getCategoryTextColor(product.category || '');

                    return (
                        <div
                            key={product.id}
                            className="product-item card"
                            onClick={() => onSelect(product)}
                            style={{ cursor: 'pointer' }}
                        >
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

                            {/* Right: Price & Add Icon */}
                            <div className="product-price-block">
                                <span className="price-tag">${product.basePrice.toFixed(0)}</span>
                                <div className="product-actions">
                                    <div className="btn-icon-sm" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                                        <Plus size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
