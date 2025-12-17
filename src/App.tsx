import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Purchase } from './pages/Purchase';
import { History } from './pages/History';
import './App.css';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
