import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, Store, CreditCard } from 'lucide-react';
import './Home.css';

const COLORS = ['#facc15', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f97316'];

export const Home: React.FC = () => {
    const { theme } = useTheme();
    const purchases = useLiveQuery(() => db.purchases.toArray());

    const stats = useMemo(() => {
        if (!purchases) return {
            monthly: [],
            topProducts: [],
            currentMonthTotal: 0,
            storeStats: [],
            lastPurchase: null
        };

        const today = new Date();
        const currentMonthKey = today.toISOString().slice(0, 7); // YYYY-MM
        let currentTotal = 0;

        // Maps
        const monthlyMap = new Map<string, number>();
        const productMap = new Map<string, number>();
        const storeMap = new Map<string, number>();

        purchases.forEach(p => {
            const dateStr = p.date instanceof Date ? p.date.toISOString() : new Date(p.date).toISOString();
            const monthKey = dateStr.slice(0, 7);
            const amount = p.total;

            // Monthly
            monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + amount);

            // Current Month Stats
            if (monthKey === currentMonthKey) {
                currentTotal += amount;
                // Store Stats (Current Month only or Global? Let's do Global for now or clarify. 
                // User asked for "Resumen inicial con consumo total por supermercado". 
                // Usually global is better for "Total by Store", but monthly is better for budget.
                // Let's do "Global by Store" as a general stat)
            }
            // Actually let's do Store Stats based on ALL time to show preference
            storeMap.set(p.storeName, (storeMap.get(p.storeName) || 0) + amount);

            // Products
            p.items.forEach(item => {
                productMap.set(item.productName, (productMap.get(item.productName) || 0) + item.quantity);
            });
        });

        // Format Monthly
        const monthly = Array.from(monthlyMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6)
            .map(([key, value]) => ({
                name: key.split('-')[1], // Just show month number or name? 
                fullName: key,
                total: value
            }));

        // Format Top Products
        const topProducts = Array.from(productMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        // Format Store Stats
        const storeStats = Array.from(storeMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value }));

        const lastPurchase = purchases.length > 0
            ? purchases.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
            : null;

        return { monthly, topProducts, currentMonthTotal: currentTotal, storeStats, lastPurchase };
    }, [purchases]);

    if (!purchases) return <div className="loading-state">Cargando datos...</div>;

    const isDark = theme === 'dark';
    const chartTextColor = isDark ? '#e5e7eb' : '#374151';
    const tooltipStyle = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        color: isDark ? '#f9fafb' : '#111827'
    };

    return (
        <div className="dashboard-container">
            {/* Summary Cards */}
            <section className="summary-grid">
                <div className="card summary-card primary">
                    <div className="card-icon">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3>Gasto Este Mes</h3>
                        <p className="big-number">${stats.currentMonthTotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="card summary-card">
                    <div className="card-icon">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <h3>Total Compras</h3>
                        <p className="big-number">{purchases.length}</p>
                    </div>
                </div>

                <div className="card summary-card">
                    <div className="card-icon">
                        <Store size={24} />
                    </div>
                    <div>
                        <h3>Top Local</h3>
                        <p className="big-number text-sm">
                            {stats.storeStats.length > 0 ? stats.storeStats[0].name : '-'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Charts Row 1 */}
            <section className="charts-grid">
                <div className="card chart-card">
                    <h3>Gasto Mensual</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthly}>
                                <XAxis dataKey="name" stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Productos Favoritos</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topProducts}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.topProducts.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDark ? '#1f2937' : '#fff'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Store Breakdown */}
            <section className="card store-list-card">
                <h3>Gastos por Supermercado (Total)</h3>
                <div className="store-list">
                    {stats.storeStats.map((store, index) => (
                        <div key={store.name} className="store-item">
                            <div className="store-info">
                                <span className="rank-badge">{index + 1}</span>
                                <span className="name">{store.name}</span>
                            </div>
                            <div className="store-total">
                                <div className="bar-bg">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(store.value / (stats.storeStats[0]?.value || 1)) * 100}%`,
                                            backgroundColor: COLORS[index % COLORS.length]
                                        }}
                                    />
                                </div>
                                <span className="amount">${store.value.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                    {stats.storeStats.length === 0 && <p className="text-muted">Sin datos aún.</p>}
                </div>
            </section>
        </div>
    );
};
