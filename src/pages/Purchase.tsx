import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, type PurchaseItem } from '../db/db';
import { ProductSelector } from '../components/ProductSelector';
import { type Product } from '../db/db';
import { Trash2, Plus, Save, Calendar, Store } from 'lucide-react';
import './Purchase.css';

export const Purchase: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editPurchaseId = location.state?.editPurchaseId as number | undefined;

    // Use local date for default (sv-SE gives YYYY-MM-DD format)
    const getLocalDate = () => {
        return new Date().toLocaleDateString('sv-SE');
    };

    const [date, setDate] = useState(getLocalDate());
    const [storeName, setStoreName] = useState('');
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [discount, setDiscount] = useState<string>('');

    // Load purchase data if editing
    useEffect(() => {
        if (editPurchaseId) {
            db.purchases.get(editPurchaseId).then(purchase => {
                if (purchase) {
                    const d = purchase.date;
                    // Format Date object to YYYY-MM-DD using local time methods
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const localDateStr = `${year}-${month}-${day}`;

                    setDate(localDateStr);
                    setStoreName(purchase.storeName);
                    setItems(purchase.items);
                    setDiscount(purchase.discount > 0 ? purchase.discount.toString() : '');
                }
            });
        }
    }, [editPurchaseId]);

    // Totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = parseFloat(discount) || 0;
    const total = Math.max(0, subtotal - discountAmount);

    const handleSelectProduct = (product: Product) => {
        // Simple prompt for now
        const qtyStr = prompt(`Cantidad for ${product.name}:`, '1');
        if (qtyStr === null) return;
        const qty = parseFloat(qtyStr);

        const priceStr = prompt(`Precio for ${product.name}:`, product.basePrice.toString());
        if (priceStr === null) return;
        const price = parseFloat(priceStr);

        if (isNaN(qty) || isNaN(price)) {
            alert('Valores inválidos');
            return;
        }

        const newItem: PurchaseItem = {
            productId: product.id || 0, // 0 for manual items
            productName: product.name,
            quantity: qty,
            price: price
        };

        setItems([...items, newItem]);
        setIsSelectorOpen(false);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleSave = async () => {
        if (!storeName) {
            alert('Ingresa el nombre del local');
            return;
        }
        if (items.length === 0) {
            alert('Agrega al menos un producto');
            return;
        }

        try {
            // Construct Date object from local date components to avoid UTC shift
            const [y, m, d] = date.split('-').map(Number);
            const localDateObj = new Date(y, m - 1, d); // Month is 0-indexed

            const purchaseData = {
                date: localDateObj,
                storeName,
                items,
                subtotal,
                discount: discountAmount,
                total
            };

            if (editPurchaseId) {
                await db.purchases.update(editPurchaseId, purchaseData);
                alert('Compra actualizada!');
            } else {
                await db.purchases.add(purchaseData);
                alert('Compra guardada!');
            }
            navigate('/history');
        } catch (error) {
            console.error('Error saving purchase:', error);
            alert('Error al guardar la compra');
        }
    };

    if (isSelectorOpen) {
        return (
            <ProductSelector
                onSelect={handleSelectProduct}
                onCancel={() => setIsSelectorOpen(false)}
            />
        );
    }

    return (
        <div className="purchase-container">
            <header className="purchase-header">
                <div className="header-row">
                    <div className="input-icon-wrapper">
                        <Calendar size={18} />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="header-row">
                    <div className="input-icon-wrapper full-width">
                        <Store size={18} />
                        <input
                            type="text"
                            placeholder="Nombre del supermercado/local"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="purchase-items">
                {items.length === 0 ? (
                    <div className="empty-cart">
                        <p>Tu carrito está vacío</p>
                        <button className="btn-add-item" onClick={() => setIsSelectorOpen(true)}>
                            <Plus size={20} /> Agregar Producto
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="items-list">
                            {items.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="item-details">
                                        <span className="item-name">{item.productName}</span>
                                        <span className="item-qty">{item.quantity} x ${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="item-total">
                                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                                        <button onClick={() => handleRemoveItem(index)} className="btn-remove">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-add-more" onClick={() => setIsSelectorOpen(true)}>
                            <Plus size={18} /> Agregar otro producto
                        </button>
                    </>
                )}

                {/* FAB Button */}
                <button className="fab-add-button" onClick={() => setIsSelectorOpen(true)} aria-label="Agregar Producto">
                    <Plus size={32} />
                </button>
            </div>

            <footer className="purchase-footer">
                <div className="totals-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="totals-row discount">
                    <span>Descuento ($):</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                </div>
                <div className="totals-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button className="btn-save-purchase" onClick={handleSave}>
                    <Save size={20} /> Guardar Compra
                </button>
            </footer>
        </div>
    );
};
