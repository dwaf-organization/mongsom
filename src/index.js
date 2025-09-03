import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';
import Header from './layout/header/Header.jsx';
import Footer from './layout/footer/Footer.jsx';
import { ToastProvider } from './context/ToastContext';

// 전역 세션 관리 함수들
window.isAuthenticated = () => {
  return !!sessionStorage.getItem('userId');
};

window.getUserId = () => {
  return sessionStorage.getItem('userId');
};

window.login = userId => {
  sessionStorage.setItem('userId', userId);
};

window.logout = () => {
  sessionStorage.removeItem('userId');
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Header />
        <App />
        <Footer />
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
