import { useState, useEffect } from 'react';
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

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!userCode) return;
    try {
      const items = await getCart(userCode);
      setCart(items.cartItems ?? []);
    } catch (e) {
      console.error(e);
      setCart([]);
    }
  };

  useEffect(() => {
    let cancelled = false;
    if (!userCode) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const items = await getCart(userCode);
        if (!cancelled) setCart(items.cartItems ?? []);
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

  const allChecked = cart.length > 0 && cart.every(i => i.checkStatus === 1);

  const handleAllCheckChange = checked => {
    updateCart(cart.map(i => ({ ...i, checkStatus: Number(checked) })));
  };

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
      <h2 className='text-2xl font-semibold font-pretendard pb-5 text-center'>
        장바구니
      </h2>
      <BreadCrumbSection currentStep='cart' />

      <AllCheckBoxSection
        allChecked={allChecked}
        onAllCheckChange={handleAllCheckChange}
        refreshCart={fetchCart}
      />

      <CartItemListSection cart={cart} updateCart={updateCart} refreshCart={fetchCart} />

      <CartPriceSummarySection cart={cart} />

      <PurchaseBar />
    </InnerPaddingSectionWrapper>
  );
}
