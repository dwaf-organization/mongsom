import { useState, useMemo } from 'react';
import { Button } from '../button';
import { useAuth } from '../../../context/AuthContext';
import {
  openPaymentWidget,
  createPaymentData,
} from '../../../utils/tossPayments';
import { createOrder } from '../../../api/order';

export default function PaymentButton({
  selectedItems,
  customerInfo,
  disabled = false,
  deliveryPrice: deliveryPriceProp,
}) {
  console.log('🚀 ~ PaymentButton ~ selectedItems:', selectedItems);
  const { userCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isOptionSelected =
    Array.isArray(selectedItems) && selectedItems.length > 0;

  const { totalPrice, totalDiscountPrice, deliveryPrice, finalPrice } =
    useMemo(() => {
      const base = (selectedItems || []).reduce(
        (acc, it) => {
          const quantity = Number(it.quantity ?? 1);
          const price = Number(it.price ?? 0);
          const discountPrice = Number(
            it.discountPrice ?? it.salePrice ?? it.price ?? 0,
          );
          acc.totalPrice += discountPrice * quantity;
          acc.totalDiscountPrice +=
            Math.max(0, price - discountPrice) * quantity;
          return acc;
        },
        { totalPrice: 0, totalDiscountPrice: 0 },
      );
      const dp =
        typeof deliveryPriceProp === 'number' ? deliveryPriceProp : 3000;
      const finalP = base.totalPrice - base.totalDiscountPrice + dp;
      console.log(
        '🚀 ~ PaymentButton ~ base.totalDiscountPrice:',
        base.totalDiscountPrice,
      );
      console.log('🚀 ~ PaymentButton ~ finalP:', finalP);
      return {
        totalPrice: base.totalPrice,
        totalDiscountPrice: base.totalDiscountPrice,
        deliveryPrice: dp,
        finalPrice: finalP,
      };
    }, [selectedItems, deliveryPriceProp]);
  console.log('🚀 ~ PaymentButton ~ totalPrice:', totalPrice);

  const buildOrderPayload = () => {
    const phoneDigits =
      (customerInfo?.phone && String(customerInfo.phone).replace(/\D/g, '')) ||
      [customerInfo?.phone1, customerInfo?.phone2, customerInfo?.phone3]
        .filter(Boolean)
        .join('');

    return {
      userCode: Number(userCode),

      receivedUserName: customerInfo?.name ?? '',
      receivedUserPhone: phoneDigits ?? '',
      receivedUserZipCode:
        customerInfo?.zipCode ?? customerInfo?.address?.zipCode ?? '',
      receivedUserAddress:
        customerInfo?.address ??
        customerInfo?.addressLine ??
        customerInfo?.address?.address ??
        '',
      receivedUserAddress2:
        customerInfo?.address2 ??
        customerInfo?.addressDetail ??
        customerInfo?.address?.address2 ??
        '',
      message: customerInfo?.additionalInfo ?? '',

      totalPrice,
      deliveryPrice,
      totalDiscountPrice,
      finalPrice,

      // 결제 전 단계: 안전값으로 둔다
      paymentAt: '2024-09-17T15:30:00',
      paymentMethod: '카드',
      paymentAmount: finalPrice,
      paymentStatus: 'PAUSE',
      paymentKey: 'toss_12345',
      pgProvider: '토스페이먼츠',

      orderDetails: (selectedItems || []).map(it => ({
        optId: it.optId ?? null,
        productId: it.productId,
        quantity: Number(it.quantity ?? 1),
        price: Number(it.discountPrice ?? it.price ?? 0),
      })),
    };
  };

  // const extractOrderId = res => {
  //   // 서버가 주는 형태에 맞춰 안전하게 추출
  //   return (
  //     res?.orderId ??
  //     res?.result?.orderId ??
  //     (typeof res === 'string' ? res : null)
  //   );
  // };

  const handlePayment = async () => {
    if (isLoading) return; // 연타 방지
    if (disabled || !isOptionSelected) return alert('선택된 상품이 없습니다.');
    if (!userCode) return alert('로그인이 필요합니다.');
    if (!customerInfo?.name) return alert('고객 정보를 입력해주세요.');
    if (!Number.isFinite(finalPrice) || finalPrice < 100)
      return alert('결제 금액이 올바르지 않습니다. (최소 100원)');

    try {
      setIsLoading(true);

      // 1) 주문(혹은 사전 주문) 생성 -> 반드시 "새로운" orderId 반환
      const orderPayload = buildOrderPayload();
      const orderRes = await createOrder(orderPayload);
      const orderId = orderRes;
      if (!orderId) {
        const msg = orderRes?.message || '서버에서 orderId를 받지 못했습니다.';
        throw new Error(msg);
      }

      const paymentData = createPaymentData(selectedItems, customerInfo, {
        orderId,
        amount: finalPrice,
      });

      await openPaymentWidget(paymentData);
    } catch (error) {
      console.error('결제 실패:', error);
      alert(
        `결제 요청에 실패했습니다.\n${error?.message ? `오류: ${error.message}` : ''}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center'>
      <Button
        className='w-fit px-10 py-2 mt-10 font-bold text-xl font-pretendard bg-black-100 text-white hover:bg-black-100/90 disabled:bg-gray-400 disabled:cursor-not-allowed'
        onClick={handlePayment}
        disabled={disabled || isLoading}
      >
        {isLoading ? '결제 처리 중...' : '결제하기'}
      </Button>
    </div>
  );
}
