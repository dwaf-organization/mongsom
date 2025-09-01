import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './view/Main';
import Brand from './view/Brand';
import Shop from './view/Shop';
import ShopDetail from './view/ShopDetail';
import Notice from './view/Notice';
import Cart from './view/Cart';

export default function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/brand' element={<Brand />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop-detail/:id' element={<ShopDetail />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
    </div>
  );
}
