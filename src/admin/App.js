import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Products from './view/Products';
import OrderList from './view/OrderList';
import ProductList from './view/ProductList';
import Exchange from './view/Exchange';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import GlobalToast from './components/ui/GlobalToast';
import GlobalModal from './components/ui/GlobalModal';

export default function AdminApp() {
  return (
    <ToastProvider>
      <ModalProvider>
        <AdminLayout>
          <Routes>
            <Route path='/' element={<OrderList />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products-list' element={<ProductList />} />
            <Route path='/orders' element={<OrderList />} />
            <Route path='/notice' element={<div>공지 관리 페이지</div>} />
            <Route path='/exchange-return' element={<Exchange />} />
          </Routes>
          <GlobalToast />
          <GlobalModal />
        </AdminLayout>
      </ModalProvider>
    </ToastProvider>
  );
}
