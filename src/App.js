import { Routes, Route } from 'react-router-dom';
import './App.css';

import ShopApp from './shop/App';

import AdminApp from './admin/App';

export default function App() {
  return (
    <Routes>
      <Route path='/admin/*' element={<AdminApp />} />

      <Route path='/*' element={<ShopApp />} />
    </Routes>
  );
}
