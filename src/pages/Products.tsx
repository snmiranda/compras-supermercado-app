import React, { useState } from 'react';
import { ProductList } from '../components/ProductList';
import { ProductForm } from '../components/ProductForm';
import { type Product } from '../db/db';

export const Products: React.FC = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const handleAdd = () => {
        setEditingProduct(undefined);
        setView('form');
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setView('form');
    };

    const handleSave = () => {
        setView('list');
        setEditingProduct(undefined);
    };

    const handleCancel = () => {
        setView('list');
        setEditingProduct(undefined);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {view === 'list' ? (
                <>
                    <h1 style={{ marginBottom: '1rem' }}>Mis Productos</h1>
                    <ProductList onAdd={handleAdd} onEdit={handleEdit} />
                </>
            ) : (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};
