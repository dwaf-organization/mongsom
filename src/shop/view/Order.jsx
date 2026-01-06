import { useState, useEffect, useMemo, useCallback } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/cart/BreadCrumbSection';
import OrderItemListSection from '../components/section/order/OrderItemListSection';
import AddressInfoSection from '../components/section/order/AddressInfoSection';
import OrderSummarySection from '../components/section/order/OrderSummarySection';
import PaymentButton from '../components/ui/order/PaymentButton';

import { useAuth } from '../context/AuthContext';
import { getCart } from '../api/cart';
import { getUserInfo } from '../api/myPage';
import { getmileage } from '../api/order';
import { clearInstantPurchase } from '../utils/instantPurchase';

const INSTANT_KEY = 'instantPurchase';

function getInstantPurchase() {
  const raw = sessionStorage.getItem(INSTANT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.data ?? parsed ?? null;
  } catch {
    return null;
  }
}

export default function Order() {
  const { userCode } = useAuth();

  const [cart, setCart] = useState([]);
  const [buyNowItems, setBuyNowItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [mileage, setMileage] = useState(0);

  const [isFormValid, setIsFormValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ACCOUNT'); // 'ACCOUNT' | 'CARD'
  const [useMileage, setUseMileage] = useState(0); // 사용할 마일리지

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);

  // 바로구매 데이터 로드 (새로고침해도 유지)
  useEffect(() => {
    const instant = getInstantPurchase();

    if (instant?.product && Array.isArray(instant.options)) {
      setBuyNowItems(instant.options);
    } else {
      setBuyNowItems([]);
    }
  }, []);

  // 페이지 이탈 시 바로구매 데이터 삭제 (뒤로가기)
  useEffect(() => {
    const handlePopState = () => {
      clearInstantPurchase();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 2) 사용자 정보 및 마일리지는 항상 불러옴(바로구매/장바구니 무관)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingUser(true);
        if (!userCode) {
          if (!cancelled) {
            setUserInfo(null);
            setMileage(0);
          }
          return;
        }
        const [u, m] = await Promise.all([
          getUserInfo(userCode),
          getmileage(userCode),
        ]);
        if (!cancelled) {
          setUserInfo(u);
          // mileage가 객체인 경우 mileage 프로퍼티를 추출, 그렇지 않으면 그대로 사용
          const mileageValue =
            typeof m === 'object' ? m?.mileage || 0 : (m ?? 0);
          setMileage(mileageValue);
        }
      } catch (e) {
        console.error('사용자 정보 로드 실패:', e);
        if (!cancelled) {
          setUserInfo(null);
          setMileage(0);
        }
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode]);

  console.log('🚀 ~ Order ~ mileage:', mileage);

  // 3) 장바구니는 “바로구매 없음”일 때만 불러옴
  useEffect(() => {
    let cancelled = false;

    if (!userCode || buyNowItems.length > 0) {
      setCart([]);
      setLoadingCart(false);
      return;
    }

    (async () => {
      try {
        setLoadingCart(true);
        const res = await getCart(userCode);
        const cartItems = res?.cartItems ?? [];
        if (!cancelled) setCart(cartItems);
      } catch (e) {
        if (!cancelled) setCart([]);
      } finally {
        if (!cancelled) setLoadingCart(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode, buyNowItems.length]);

  const loading = loadingUser || loadingCart;

  const selectedItems = useMemo(() => {
    if (buyNowItems.length > 0) return buyNowItems;
    return (cart || []).filter(i => i.checkStatus);
  }, [buyNowItems, cart]);

  const handleFormValidChange = useCallback((isValid, customerData) => {
    setIsFormValid(isValid);
    setCustomerInfo(customerData);
  }, []);

  if (loading) {
    return (
      <InnerPaddingSectionWrapper className='max-w-[800px]'>
        <h2 className='text-2xl font-semibold font-pretendard pb-5 text-center'>
          주문/결제
        </h2>
        <BreadCrumbSection currentStep='order' />
        <p className='text-gray-700 py-32 text-center'>불러오는 중…</p>
      </InnerPaddingSectionWrapper>
    );
  }

  if (!selectedItems || selectedItems.length === 0) {
    return (
      <InnerPaddingSectionWrapper className='max-w-[800px]'>
        <h2 className='text-2xl font-semibold font-pretendard pb-5 text-center'>
          주문/결제
        </h2>
        <BreadCrumbSection currentStep='order' />
        <p className='text-gray-700 py-32 text-center'>
          주문할 상품이 없습니다.
        </p>
      </InnerPaddingSectionWrapper>
    );
  }

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-2xl font-semibold font-pretendard pb-5 text-center'>
        주문/결제
      </h2>
      <BreadCrumbSection currentStep='order' />

      <OrderItemListSection selectedItems={selectedItems} />

      <AddressInfoSection
        onFormValidChange={handleFormValidChange}
        userInfo={userInfo}
      />

      <section className='mb-4 border-t-2 border-black-100 py-4'>
        <h2 className='text-lg font-semibold mb-4'>할인혜택</h2>

        <div className='flex items-center w-full gap-2'>
          <div className=' flex justify-between items-center border border-gray-400 rounded-md p-1 w-full'>
            <span className='font-semibold whitespace-nowrap'>마일리지</span>

            <div className='flex items-center w-full'>
              <input
                type='number'
                value={useMileage}
                onChange={e => {
                  let inputValue = e.target.value;
                  // 빈 문자열이면 0으로 설정
                  if (inputValue === '') {
                    setUseMileage(0);
                    return;
                  }
                  // 숫자로 변환하여 앞의 0 제거
                  const numValue = Number(inputValue);
                  const value = Math.max(0, Math.min(numValue, mileage || 0));
                  setUseMileage(value);
                }}
                onFocus={e => {
                  e.stopPropagation();
                  // focus 시 0이면 빈 문자열로 만들어서 입력하기 쉽게 함
                  if (useMileage === 0) {
                    e.target.value = '';
                  }
                }}
                onBlur={e => {
                  // blur 시 빈 문자열이면 0으로 설정
                  if (e.target.value === '') {
                    setUseMileage(0);
                  }
                }}
                onClick={e => e.stopPropagation()}
                className=' py-1 text-right w-full focus:outline-none focus:border-none'
                min='0'
                max={mileage || 0}
              />
              <span className=''>원</span>
            </div>
          </div>

          <button
            type='button'
            onClick={() => {
              if (useMileage > 0) {
                setUseMileage(0);
              } else {
                setUseMileage(mileage || 0);
              }
            }}
            className='px-3 py-1.5 border border-gray-400 rounded hover:bg-gray-100 whitespace-nowrap'
          >
            {useMileage > 0 ? '사용 취소' : '모두 사용'}
          </button>
        </div>
        <p className='text-sm text-gray-600'>
          사용가능: {((mileage || 0) - useMileage).toLocaleString()}원 | 보유
          마일리지: {(mileage || 0).toLocaleString()}원
        </p>
      </section>

      <section className='mb-4 border-t-2 border-black-100 py-4'>
        <h2 className='text-lg font-semibold'>결제 수단 선택</h2>

        <div className='flex items-center gap-4 mt-3'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='paymentMethod'
              value='ACCOUNT'
              checked={paymentMethod === 'ACCOUNT'}
              onChange={e => setPaymentMethod(e.target.value)}
              className='w-4 h-4'
            />
            <span>무통장 입금</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name='paymentMethod'
              value='CARD'
              checked={paymentMethod === 'CARD'}
              onChange={e => setPaymentMethod(e.target.value)}
              className='w-4 h-4'
            />
            <span>일반결제</span>
          </label>
        </div>
      </section>

      <OrderSummarySection items={selectedItems} />

      <PaymentButton
        selectedItems={selectedItems}
        customerInfo={customerInfo}
        disabled={!isFormValid}
        paymentMethod={paymentMethod}
      />
    </InnerPaddingSectionWrapper>
  );
}
