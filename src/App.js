import { Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './view/Main';
import Brand from './view/Brand';
import Product from './view/Product';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </div>
  );
}