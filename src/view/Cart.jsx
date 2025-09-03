import { useState, useEffect } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import PurchaseBar from '../components/ui/cart/PurchaseBar';
import {
  AllCheckBoxSection,
  CartItemListSection,
  CartPriceSummarySection,
  BreadCrumbSection,
} from '../components/section/cart';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const allChecked = cart.length > 0 ? cart.every(item => item.checked) : false;

  useEffect(() => {
    const sessionCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    setCart(sessionCart);
  }, []);

  const updateCart = updatedCart => {
    setCart(updatedCart);
  };

  const handleAllCheckChange = checked => {
    const updatedCart = cart.map(item => ({ ...item, checked }));
    updateCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-2xl font-semibold font-pretendard pb-5'>장바구니</h2>

      <BreadCrumbSection currentStep='cart' />
      <AllCheckBoxSection
        allChecked={allChecked}
        onAllCheckChange={handleAllCheckChange}
      />
      <CartItemListSection cart={cart} updateCart={updateCart} />
      <CartPriceSummarySection cart={cart} />
      <PurchaseBar />
    </InnerPaddingSectionWrapper>
  );
}
