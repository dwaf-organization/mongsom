import { useState, useMemo } from 'react';
import { Button } from '../button';
import { useAuth } from '../../../context/AuthContext';
import {
  openPaymentWidget,
  createPaymentData,
} from '../../../utils/tossPayments';
import { createOrder } from '../../../api/order'; // ← 주문 생성 API (아래 포맷 따라감)

export default function PaymentButton({
  selectedItems,
  customerInfo,
  disabled = false,
  deliveryPrice: deliveryPriceProp, // 옵션: 부모가 배송비 내려줄 수 있게
}) {
  const { userCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isOptionSelected =
    Array.isArray(selectedItems) && selectedItems.length > 0;

  // 총액 계산(선택된 아이템 기준)
  const { totalPrice, totalDiscountPrice, deliveryPrice, finalPrice } =
    useMemo(() => {
      const base = (selectedItems || []).reduce(
        (acc, it) => {
          const quantity = Number(it.quantity ?? 1);
          const price = Number(it.price ?? 0);
          const discountPrice = Number(it.discountPrice ?? it.price ?? 0);

          acc.totalPrice += price * quantity;
          acc.totalDiscountPrice +=
            Math.max(0, price - discountPrice) * quantity;
          return acc;
        },
        { totalPrice: 0, totalDiscountPrice: 0 },
      );

      // 배송비: 외부에서 주면 사용, 없으면 기본 0
      const dp = typeof deliveryPriceProp === 'number' ? deliveryPriceProp : 0;
      const finalP = base.totalPrice - base.totalDiscountPrice + dp;

      return {
        totalPrice: base.totalPrice,
        totalDiscountPrice: base.totalDiscountPrice,
        deliveryPrice: dp,
        finalPrice: finalP,
      };
    }, [selectedItems, deliveryPriceProp]);

  const buildOrderPayload = () => {
    // 전화번호 “숫자만” 합치기
    const phoneDigits =
      (customerInfo?.phone && String(customerInfo.phone).replace(/\D/g, '')) ||
      // 혹시 분할돼 있다면
      [customerInfo?.phone1, customerInfo?.phone2, customerInfo?.phone3]
        .filter(Boolean)
        .join('');

    return {
      // ✅ 서버 요구 포맷에 맞춤
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
      paymentAt: '2024-09-17T15:30:00',
      paymentMethod: '카드',
      paymentAmount: finalPrice,
      paymentStatus: 'PAUSE',
      paymentKey: 'test_payment_key',
      pgProvider: '토스페이먼츠',

      // 주문 상세
      orderDetails: (selectedItems || []).map(it => ({
        optId: it.optId ?? null,
        productId: it.productId,
        quantity: Number(it.quantity ?? 1),
        // 서버가 “개별 항목 금액”을 받는다면: 할인 적용된 금액으로 전달
        price: Number(it.discountPrice ?? it.price ?? 0),
      })),
    };
  };

  const handlePayment = async () => {
    if (disabled || !isOptionSelected) {
      alert('선택된 상품이 없습니다.');
      return;
    }
    if (!userCode) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!customerInfo?.name) {
      alert('고객 정보를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const orderPayload = buildOrderPayload();
      const orderData = await createOrder(orderPayload);
      const orderId = orderData;

      // if (!orderId) throw new Error('주문번호가 없습니다.');

      if (!orderId) {
        const newOrderId = `${Date.now()}`;
        orderId = newOrderId;
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
