# 🛒 Gestión de Compras PWA  
Aplicación diseñada para registrar compras y analizar gastos en supermercado  
Pensada principalmente para uso en celulares 📱  

**Gestión de Compras PWA** es una aplicación web progresiva que permite organizar compras, controlar gastos, visualizar estadísticas y administrar productos sin necesidad de usar Excel.  

El proyecto fue diseñado con un enfoque **Mobile-First**, permitiendo instalarse como una aplicación en el teléfono y funcionar sin conexión a Internet gracias a IndexedDB.

---

## 🚀 Tecnologías utilizadas

- **React 19** – Framework de UI moderno
- **Vite** – Build tool rápido
- **Dexie.js (IndexedDB)** – Base de datos local offline
- **Recharts** – Dashboard de consumo
- **Lucide React** – Iconografía moderna
- **Context + CSS Variables** – Diseño responsivo y modo oscuro
- **ExcelJS** – Exportación de compras mensuales a Excel

---

## 📌 Funcionalidades

### 🛒 Registro de compras
- Crear tickets guardando fecha, productos, cantidades y precios  
- Cálculo automático de totales  

### 📦 Gestión de productos
- Alta, baja y edición de productos
- Precios y categorías
- Imágenes opcionales

### 📊 Análisis visual (Dashboard)
- Gastos por mes
- Consumo por supermercado
- Productos más comprados

### 📱 PWA – Uso como app móvil
- Instalable en teléfono Android o iOS
- Acceso desde el escritorio del móvil
- Carga extremadamente rápida
- Funciona sin conexión

### 🗂️ Historial + exportación a Excel
- Consulta de compras anteriores
- Filtros por mes
- Exportación del mes a archivo Excel

---

## 📱 Instalación en celulares (recomendado)

La aplicación está pensada principalmente para usarse desde el celular.

### En Android (Chrome)
1. Abrí el enlace web
2. Tocá los tres puntos del navegador
3. Elegí **“Instalar app”**
4. Confirmá  
👉 La app aparecerá en tu menú como si fuera nativa

### En iPhone (Safari)
1. Abrí el enlace web en Safari
2. Tocá **Compartir → Agregar al Inicio**
3. Confirmá la instalación

Luego podrás usarla:
- sin Internet,
- a pantalla completa,
- más rápido que desde navegador.

---

## 🧾 Objetivo del proyecto
Crear una herramienta simple para:
- seguir gastos del hogar,
- reemplazar planillas de Excel tradicionales,
- registrar compras reales,
- almacenar datos sin servidores,
- y visualizar estadísticas útiles.

Ideal para:
- familias,
- personas que compran semanalmente,
- pequeños comercios,
- control financiero personal.

---

## 🛠️ Cómo ejecutar en local

```bash
npm install
npm run dev
