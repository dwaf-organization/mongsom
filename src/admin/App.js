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
import EditProductInfo from './view/EditProductInfo';
import Notice from './view/Notice';
import './index.css';
import 'quill/dist/quill.snow.css';

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
            <Route path='/notice' element={<Notice />} />
            <Route path='/exchange-return' element={<Exchange />} />
            <Route
              path='/edit-product-info/:id'
              element={<EditProductInfo />}
            />
          </Routes>
          <GlobalToast />
          <GlobalModal />
        </AdminLayout>
      </ModalProvider>
    </ToastProvider>
  );
}
