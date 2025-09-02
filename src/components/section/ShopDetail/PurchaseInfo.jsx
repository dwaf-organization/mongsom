import { useState } from 'react';

import ProductHeader from '../../ui/ShopDetail/ProductHeader';
import OptionSelector from '../../ui/ShopDetail/OptionSelector';
import TotalPrice from '../../ui/ShopDetail/TotalPrice';
import PurchaseBar from '../../ui/ShopDetail/PurchaseBar';

export default function PurchaseInfo({ product }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleTotalPriceChange = newTotalPrice => {
    setTotalPrice(newTotalPrice);
  };

  const handleOptionsChange = options => {
    setSelectedOptions(options);
  };

  const handleAddToCart = () => {
    if (selectedOptions.length === 0) {
      alert('옵션을 선택해주세요.');
      return;
    }

    // 세션에서 기존 장바구니 데이터 가져오기
    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');

    // 새로운 상품들을 장바구니에 추가
    const newCartItems = selectedOptions.map(option => ({
      id: Date.now() + Math.random(), // 고유 ID 생성
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      option: option.name,
      count: option.quantity,
      checked: true,
    }));

    const updatedCart = [...existingCart, ...newCartItems];
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));

    alert('장바구니에 상품이 추가되었습니다!');
    console.log('장바구니에 추가된 상품:', newCartItems);
  };

  return (
    <div className='flex flex-col gap-4 min-w-[400px] px-4'>
      <ProductHeader product={product} />
      <OptionSelector
        product={product}
        onTotalPriceChange={handleTotalPriceChange}
        onOptionsChange={handleOptionsChange}
      />
      <TotalPrice totalPrice={totalPrice} />
      <PurchaseBar onAddToCart={handleAddToCart} />
    </div>
  );
}
