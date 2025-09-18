// pages/Order.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/cart/BreadCrumbSection';
import OrderItemListSection from '../components/section/order/OrderItemListSection';
import AddressInfoSection from '../components/section/order/AddressInfoSection';
import OrderSummarySection from '../components/section/order/OrderSummarySection';
import PaymentButton from '../components/ui/order/PaymentButton';

import { useAuth } from '../context/AuthContext';
import { getCart } from '../api/cart';
import { getUserInfo } from '../api/myPage';

// (유틸) 세션에서 1회용으로 꺼내기
function popInstantPurchase() {
  const KEY = 'instantPurchase';
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    sessionStorage.removeItem(KEY); // 읽자마자 삭제 (1회용)
    return parsed?.data ?? parsed ?? null; // data 래핑/미래 대응
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export default function Order() {
  const { userCode } = useAuth();

  const [cart, setCart] = useState([]);
  const [buyNowItems, setBuyNowItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);

  // pop은 최초 1회만 수행하도록 가드
  const poppedRef = useRef(false);

  // 1) 세션의 즉시구매 아이템 로드 → 화면용 스키마로 매핑
  useEffect(() => {
    if (poppedRef.current) return;
    poppedRef.current = true;

    const instant = popInstantPurchase(); // { product, options } 형태(권장)

    if (instant?.product && Array.isArray(instant.options)) {
      const product = instant.product;

      const productId = Number(product.productId ?? product.id);
      const name = product.name ?? '';
      const price = Number(product.price ?? 0);
      const discountPer = Number(product.discountPer ?? 0);
      const discountPrice = Number(
        product.discountPrice ?? product.salePrice ?? product.price ?? 0,
      );

      const productImgUrl = Array.isArray(product.productImgUrl)
        ? product.productImgUrl
        : Array.isArray(product.productImgUrls)
          ? product.productImgUrls
          : Array.isArray(product.image)
            ? product.image
            : product.productImgUrl
              ? [product.productImgUrl]
              : [];

      const mapped = instant.options.map((o, idx) => ({
        cartId: `instant-${o.optId ?? 'noopt'}-${idx}`, // 로컬 키
        optId: o.optId ?? Number(o.value ?? null) ?? null,
        optName: o.optName ?? o.label ?? null,

        productId,
        productName: name,
        price,
        discountPer,
        discountPrice,
        quantity: Number(o.quantity ?? 1),
        checkStatus: true,
        productImgUrl,
      }));

      setBuyNowItems(mapped);
    } else {
      // 세션이 없으면 빈 배열 유지
      setBuyNowItems([]);
    }
  }, []);

  // 2) 사용자 정보는 항상 불러옴(바로구매/장바구니 무관)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingUser(true);
        if (!userCode) {
          if (!cancelled) setUserInfo(null);
          return;
        }
        const u = await getUserInfo(userCode);
        if (!cancelled) setUserInfo(u);
      } catch (e) {
        if (!cancelled) setUserInfo(null);
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode]);

  // 3) 장바구니는 “바로구매 없음”일 때만 불러옴
  useEffect(() => {
    let cancelled = false;

    // 바로구매면 카트 로딩 스킵
    if (!userCode || buyNowItems.length > 0) {
      setCart([]);
      setLoadingCart(false);
      return;
    }

    (async () => {
      try {
        setLoadingCart(true);
        const items = await getCart(userCode);
        if (!cancelled) setCart(Array.isArray(items) ? items : []);
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

  // 4) 최종 주문 대상
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
        <h2 className='text-4xl font-semibold font-pretendard pb-5'>
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
        <h2 className='text-4xl font-semibold font-pretendard pb-5'>
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
