import { useState, useEffect, useCallback } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/cart/BreadCrumbSection';
import OrderItemListSection from '../components/section/order/OrderItemListSection';
import AddressInfoSection from '../components/section/order/AddressInfoSection';
import OrderSummarySection from '../components/section/order/OrderSummarySection';
import PaymentButton from '../components/ui/order/PaymentButton';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../api/cart';
import { getUserInfo } from '../api/myPage';

export default function Order() {
  const [cart, setCart] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const { userCode } = useAuth();

  useEffect(() => {
    let cancelled = false;
    if (!userCode) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);

        // 장바구니와 사용자 정보를 병렬로 가져오기
        const [cartItems, userData] = await Promise.all([
          getCart(userCode),
          getUserInfo(userCode),
        ]);

        if (!cancelled) {
          setCart(cartItems);
          setUserInfo(userData);
        }
      } catch (e) {
        console.error('데이터 로드 실패:', e);
        if (!cancelled) {
          setCart([]);
          setUserInfo(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode]);

  const selectedItems = cart.filter(item => item.checkStatus);

  const handleFormValidChange = useCallback((isValid, customerData) => {
    console.log('폼 유효성 변경:', {
      isValid,
      customerData,
      hasName: !!customerData?.name,
      hasEmail: !!customerData?.email,
    });
    setIsFormValid(isValid);
    setCustomerInfo(customerData);
  }, []);

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-4xl font-semibold font-pretendard pb-5'>주문/결제</h2>
      <BreadCrumbSection currentStep='order' />
      <OrderItemListSection selectedItems={selectedItems} />
      <AddressInfoSection
        onFormValidChange={handleFormValidChange}
        userInfo={userInfo}
      />
      <OrderSummarySection items={selectedItems} />
      <PaymentButton
        selectedItems={selectedItems}
        customerInfo={customerInfo}
        disabled={!isFormValid}
      />
    </InnerPaddingSectionWrapper>
  );
}
