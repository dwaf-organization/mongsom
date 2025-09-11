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
  Exchange,
} from './view';
import Payment from './view/Payment';
import PaymentSuccess from './view/PaymentSuccess';
import PaymentFail from './view/PaymentFail';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import GlobalToast from './components/ui/GlobalToast';
import GlobalModal from './components/ui/GlobalModal';
import OrderDetail from './view/OrderDetail';
import CreateReview from './view/CreateReview';
import FindId from './view/FindId';
import FindPassword from './view/FindPassword';
import PasswordResetComplete from './view/PasswordResetComplete';
import GloabalLayout from './components/ui/GloabalLayout';

export default function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <GloabalLayout>
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
            <Route path='/exchange/:orderId' element={<Exchange />} />
            <Route path='/create-review/:id' element={<CreateReview />} />
            <Route path='/payment' element={<Payment />} />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/fail' element={<PaymentFail />} />
            <Route path='/find-id' element={<FindId />} />
            <Route path='/find-password' element={<FindPassword />} />
            <Route
              path='/password-reset-complete'
              element={<PasswordResetComplete />}
            />
          </Routes>
          <GlobalToast />
          <GlobalModal />
        </GloabalLayout>
      </ModalProvider>
    </ToastProvider>
  );
}
