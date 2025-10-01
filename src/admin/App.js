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
import UserManagement from './view/UserManagement';
import OrderDetail from './view/OrderDetail';
import Notice from './view/Notice';
import './index.css';
import 'quill/dist/quill.snow.css';
import Login from './view/Login';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './routes/RequireAuth';

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <AdminLayout>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route element={<RequireAuth />}>
                <Route path='/orders' element={<OrderList />} />
                <Route path='/products' element={<Products />} />
                <Route path='/products-list' element={<ProductList />} />
                <Route path='/orders' element={<OrderList />} />
                <Route path='/notice' element={<Notice />} />
                <Route path='/exchange-return' element={<Exchange />} />
                <Route
                  path='/edit-product-info/:id'
                  element={<EditProductInfo />}
                />
                <Route path='/user-management' element={<UserManagement />} />
                <Route path='/orders/:id' element={<OrderDetail />} />
              </Route>
            </Routes>
            <GlobalToast />
            <GlobalModal />
          </AdminLayout>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
