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

function popInstantPurchase() {
  const KEY = 'instantPurchase';
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    sessionStorage.removeItem(KEY);
    return parsed?.data ?? parsed ?? null;
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

  const poppedRef = useRef(false);

  useEffect(() => {
    if (poppedRef.current) return;
    poppedRef.current = true;

    const instant = popInstantPurchase();

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
