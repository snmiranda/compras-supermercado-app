import React, { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, List, History, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './MainLayout.css';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Helper to get title based on route
    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Resumen';
            case '/products': return 'Productos';
            case '/purchase': return 'Nueva Compra';
            case '/history': return 'Historial';
            default: return 'Gesti';
        }
    };

    return (
        <div className="main-layout">
            <header className="top-bar">
                <h1>{getTitle()}</h1>
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Dark Mode">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </header>

            <main className="content">
                {children}
            </main>

            <nav className="bottom-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <Home size={24} />
                    <span>Inicio</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <List size={24} />
                    <span>Productos</span>
                </NavLink>
                <NavLink to="/purchase" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <ShoppingCart size={24} />
                    <span>Nueva</span>
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <History size={24} />
                    <span>Historial</span>
                </NavLink>
            </nav>
        </div>
    );
};
