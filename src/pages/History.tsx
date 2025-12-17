import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { Trash2, ShoppingBag, Calendar, Store, Pencil } from 'lucide-react';
import './History.css';

export const History: React.FC = () => {
    const navigate = useNavigate();
    const purchases = useLiveQuery(() =>
        db.purchases.orderBy('date').reverse().toArray()
    );

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta compra? Esta acción no se puede deshacer.')) {
            try {
                await db.purchases.delete(id);
            } catch (error) {
                console.error("Error deleting purchase:", error);
                alert("Hubo un error al eliminar la compra.");
            }
        }
    };

    const handleEdit = (id: number) => {
        navigate('/purchase', { state: { editPurchaseId: id } });
    };

    if (!purchases) return <div className="loading-state">Cargando historial...</div>;

    return (
        <div className="history-container">
            {purchases.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} className="empty-icon" />
                    <p>No hay compras registradas aún.</p>
                </div>
            ) : (
                <div className="history-list">
                    {purchases.map((p) => (
                        <div key={p.id} className="card history-card animate-fade-in">
                            <div className="history-card-header">
                                <div className="store-info">
                                    <Store size={18} className="icon-subtle" />
                                    <span className="store-name">{p.storeName}</span>
                                </div>
                                <div className="date-info">
                                    <Calendar size={16} className="icon-subtle" />
                                    <span>{p.date.toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="history-card-body">
                                <div className="items-count">
                                    <span className="label">Productos</span>
                                    <span className="value">{p.items.length}</span>
                                </div>
                                <div className="total-amount">
                                    <span className="currency">$</span>
                                    {p.total.toFixed(2)}
                                </div>
                            </div>

                            <div className="history-card-footer">
                                <button
                                    className="edit-btn"
                                    onClick={() => p.id && handleEdit(p.id)}
                                    aria-label="Editar compra"
                                    style={{ marginRight: 'auto' }} // Push delete to right if flex
                                >
                                    <Pencil size={18} />
                                    <span>Editar</span>
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => p.id && handleDelete(p.id)}
                                    aria-label="Eliminar compra"
                                >
                                    <Trash2 size={18} />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
