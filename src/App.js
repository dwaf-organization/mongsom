import { Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Login,
  Main,
  Brand,
  Shop,
  ShopDetail,
  Notice,
  Cart,
  Order,
  SignUp,
  Mypage,
} from './view';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import GlobalToast from './components/ui/GlobalToast';
import GlobalModal from './components/ui/GlobalModal';
import OrderDetail from './view/OrderDetail';
import CreateReview from './view/CreateReview';

export default function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <div className='App'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/' element={<Main />} />
            <Route path='/brand' element={<Brand />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/shop-detail/:id' element={<ShopDetail />} />
            <Route path='/notice' element={<Notice />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<Order />} />
            <Route path='/mypage' element={<Mypage />} />
            <Route path='/order-detail/:id' element={<OrderDetail />} />
            <Route path='/create-review/:id' element={<CreateReview />} />
          </Routes>
          <GlobalToast />
          <GlobalModal />
        </div>
      </ModalProvider>
    </ToastProvider>
  );
}
