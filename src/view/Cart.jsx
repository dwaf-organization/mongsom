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

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-pretendard pb-5'>장바구니</h2>

      <BreadCrumbSection />
      <AllCheckBoxSection
        allChecked={allChecked}
        cart={cart}
        updateCart={updateCart}
      />
      <CartItemListSection cart={cart} updateCart={updateCart} />
      <CartPriceSummarySection cart={cart} />
      <PurchaseBar />
    </InnerPaddingSectionWrapper>
  );
}
