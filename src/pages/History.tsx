import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { Trash2, ShoppingBag, Calendar, Store, Pencil, Download, ChevronDown } from 'lucide-react';
import { exportToExcel, filterPurchasesByMonth, getAvailableMonths } from '../utils/excelExport';
import './History.css';

export const History: React.FC = () => {
    const navigate = useNavigate();
    const allPurchases = useLiveQuery(() =>
        db.purchases.orderBy('date').reverse().toArray()
    );

    const today = new Date();
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [filterByMonth, setFilterByMonth] = useState(false);

    const availableMonths = useMemo(() => {
        if (!allPurchases) return [];
        return getAvailableMonths(allPurchases);
    }, [allPurchases]);

    const purchases = useMemo(() => {
        if (!allPurchases) return null;
        if (!filterByMonth) return allPurchases;
        return filterPurchasesByMonth(allPurchases, selectedYear, selectedMonth);
    }, [allPurchases, filterByMonth, selectedYear, selectedMonth]);

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

    const handleExport = () => {
        if (!allPurchases) return;
        exportToExcel(allPurchases, selectedYear, selectedMonth);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setSelectedYear(year);
        setSelectedMonth(month);
        setFilterByMonth(true);
    };

    if (!purchases) return <div className="loading-state">Cargando historial...</div>;

    return (
        <div className="history-container">
            {/* Month Selector and Export Controls */}
            <div className="history-controls card">
                <div className="controls-row">
                    <div className="month-selector">
                        <label htmlFor="month-select">Filtrar por mes:</label>
                        <div className="select-wrapper">
                            <select
                                id="month-select"
                                value={filterByMonth ? `${selectedYear}-${selectedMonth}` : ''}
                                onChange={handleMonthChange}
                            >
                                <option value="" disabled>Seleccionar mes</option>
                                {availableMonths.map(m => (
                                    <option key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="select-icon" />
                        </div>
                        {filterByMonth && (
                            <button
                                className="btn-clear-filter"
                                onClick={() => setFilterByMonth(false)}
                            >
                                Ver todo
                            </button>
                        )}
                    </div>
                    <button
                        className="btn-export"
                        onClick={handleExport}
                        disabled={availableMonths.length === 0}
                    >
                        <Download size={18} />
                        <span>Exportar a Excel</span>
                    </button>
                </div>
                {filterByMonth && (
                    <div className="filter-info">
                        Mostrando {purchases.length} compra{purchases.length !== 1 ? 's' : ''} de {availableMonths.find(m => m.year === selectedYear && m.month === selectedMonth)?.label}
                    </div>
                )}
            </div>

            {purchases.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} className="empty-icon" />
                    <p>{filterByMonth ? 'No hay compras para el mes seleccionado.' : 'No hay compras registradas aún.'}</p>
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
                                    <span>{new Date(p.date).toLocaleDateString()}</span>
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
                                    style={{ marginRight: 'auto' }}
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
