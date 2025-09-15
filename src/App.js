import { Routes, Route } from 'react-router-dom';
import './App.css';

// Shop App
import ShopApp from './shop/App';

// Admin App
import AdminApp from './admin/App';

export default function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path='/admin/*' element={<AdminApp />} />

      {/* Shop Routes */}
      <Route path='/*' element={<ShopApp />} />
    </Routes>
  );
}
