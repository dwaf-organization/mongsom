// src/pages/Cart.jsx
import { useState, useEffect, useMemo } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Link } from 'react-router-dom';
import PurchaseBar from '../components/ui/cart/PurchaseBar';
import { getCart } from '../api/cart';
import {
  AllCheckBoxSection,
  CartItemListSection,
  CartPriceSummarySection,
  BreadCrumbSection,
} from '../components/section/cart';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const auth = useAuth();
  const userCode =
    Number(auth?.userCode) ||
    Number(auth?.user?.userCode) ||
    Number(sessionStorage.getItem('userCode')) ||
    null;

  const [cart, setCart] = useState([]); // 서버 items 그대로
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!userCode) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const items = await getCart(userCode); // [{ cartId, productName, ... }]
        if (!cancelled) setCart(items);
      } catch (e) {
        console.error(e);
        if (!cancelled) setCart([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode]);

  const updateCart = next => setCart(Array.isArray(next) ? next : []);

  const allChecked = cart.length > 0 && cart.every(i => i.checkStatus === true);

  const handleAllCheckChange = checked => {
    updateCart(cart.map(i => ({ ...i, checkStatus: Boolean(checked) })));
  };

  const { totalPrice, totalSalePrice, totalQty } = useMemo(() => {
    const sel = cart.filter(i => i.checkStatus);
    const qty = sel.reduce((s, i) => s + Number(i.quantity || 0), 0);
    const price = sel.reduce(
      (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
      0,
    );
    const sale = sel.reduce(
      (s, i) =>
        s + Number(i.discountPrice ?? i.price ?? 0) * Number(i.quantity || 0),
      0,
    );
    return { totalPrice: price, totalSalePrice: sale, totalQty: qty };
  }, [cart]);

  if (!userCode) {
    return (
      <InnerPaddingSectionWrapper className='max-w-[800px]'>
        <h2 className='text-2xl font-semibold font-pretendard text-center pb-5'>
          장바구니
        </h2>
        <BreadCrumbSection currentStep='cart' />
        <p className='text-gray-700 py-48 text-center'>
          로그인 후 이용해주세요.
        </p>
        <div className='flex justify-center'>
          <Link
            to='/login'
            className='w-fit bg-primary-200 text-white px-4 py-2 rounded-md'
          >
            로그인 하러 가기
          </Link>
        </div>
      </InnerPaddingSectionWrapper>
    );
  }

  if (loading) {
    return (
      <InnerPaddingSectionWrapper className='max-w-[800px]'>
        <h2 className='text-2xl font-semibold text-center font-pretendard pb-5'>
          장바구니
        </h2>
        <BreadCrumbSection currentStep='cart' />
        <p className='text-gray-700 py-48 text-center'>불러오는 중…</p>
      </InnerPaddingSectionWrapper>
    );
  }

  if (cart.length === 0) {
    return (
      <InnerPaddingSectionWrapper className='max-w-[800px]'>
        <h2 className='text-2xl font-semibold font-pretendard text-center pb-5'>
          장바구니
        </h2>
        <BreadCrumbSection currentStep='cart' />
        <p className='text-gray-700 py-48 text-center'>
          장바구니가 비었습니다.
        </p>
        <div className='flex justify-center'>
          <Link
            to='/shop'
            className='w-fit bg-primary-200 text-white px-4 py-2 rounded-md'
          >
            쇼핑하러 가기
          </Link>
        </div>
      </InnerPaddingSectionWrapper>
    );
  }

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
