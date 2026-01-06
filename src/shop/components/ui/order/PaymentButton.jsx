import { useState, useMemo } from 'react';
import { Button } from '../button';
import { useAuth } from '../../../context/AuthContext';
import {
  openPaymentWidget,
  createPaymentData,
} from '../../../utils/tossPayments';
import { createOrder } from '../../../api/order';
import { clearInstantPurchase } from '../../../utils/instantPurchase';

export default function PaymentButton({
  selectedItems,
  customerInfo,
  disabled = false,
  deliveryPrice: deliveryPriceProp,
  paymentMethod = 'card',
  useMileage = 0,
}) {
  console.log('🚀 ~ PaymentButton ~ selectedItems:', selectedItems);
  const { userCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isOptionSelected =
    Array.isArray(selectedItems) && selectedItems.length > 0;

  const { totalPrice, totalDiscountPrice, deliveryPrice, finalPrice } =
    useMemo(() => {
      const calcItemPrice = item => {
        if (item.totalPrice !== undefined) {
          return Number(item.totalPrice);
        }
        const unitPrice = Number(
          item.unitPrice ?? item.discountPrice ?? item.price ?? 0,
        );
        return unitPrice * Number(item.quantity ?? 1);
      };

      const totalItemPrice = (selectedItems || []).reduce(
        (sum, item) => sum + calcItemPrice(item),
        0,
      );

      // 할인 금액 계산
      const totalDiscount = (selectedItems || []).reduce((sum, item) => {
        const quantity = Number(item.quantity ?? 1);
        const basePrice = Number(item.basePrice ?? item.price ?? 0);
        const discountPrice = Number(item.discountPrice ?? basePrice);
        if (basePrice > discountPrice) {
          return sum + (basePrice - discountPrice) * quantity;
        }
        return sum;
      }, 0);

      // 배송비 계산 (5만원 이상 무료)
      const shippingFee =
        totalItemPrice >= 50000 ? 0 : totalItemPrice > 0 ? 3000 : 0;

      // 최종 금액 = 상품금액 + 배송비
      const finalP = totalItemPrice + shippingFee;

      console.log('🚀 ~ PaymentButton ~ totalItemPrice:', totalItemPrice);
      console.log('🚀 ~ PaymentButton ~ shippingFee:', shippingFee);
      console.log('🚀 ~ PaymentButton ~ finalPrice (before mileage):', finalP);

      return {
        totalPrice: totalItemPrice,
        totalDiscountPrice: totalDiscount,
        deliveryPrice: shippingFee,
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
      finalPrice: finalPrice - useMileage,
      usedMileage: useMileage,
      paymentType: paymentMethod === 'ACCOUNT' ? 'ACCOUNT' : 'CARD',

      orderDetails: (selectedItems || []).map(it => {
        const quantity = Number(it.quantity ?? 1);
        // basePrice는 할인 전 원가
        const basePrice = Number(it.basePrice ?? it.price ?? 0);
        // discountPrice는 할인된 판매가
        const discountPrice = Number(it.discountPrice ?? basePrice);
        const optionPrice = Number(it.optionPrice ?? 0);
        // unitTotalPrice = 할인된 판매가 + 옵션가
        const unitTotalPrice = discountPrice + optionPrice;
        const lineTotalPrice = unitTotalPrice * quantity;

        return {
          productId: it.productId,
          option1: it.option1 ?? null,
          option2: it.option2 ?? null,
          quantity: quantity,
          basePrice: basePrice,
          optionPrice: optionPrice,
          unitTotalPrice: unitTotalPrice,
          lineTotalPrice: lineTotalPrice,
        };
      }),
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

    const finalPaymentAmount = finalPrice - useMileage;
    if (!Number.isFinite(finalPaymentAmount) || finalPaymentAmount < 100)
      return alert('결제 금액이 100원 이상이어야 합니다.');

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

      // 바로구매 데이터 삭제
      clearInstantPurchase();

      // 무통장입금: 결제 위젯 없이 주문 완료 페이지로 이동
      if (paymentMethod === 'ACCOUNT') {
        alert('주문이 완료되었습니다.\n입금 확인 후 배송이 진행됩니다.');
        window.location.href = `/order/complete?orderId=${orderId}`;
        return;
      }

      // 일반결제: 토스 결제 위젯 열기
      const paymentData = createPaymentData(selectedItems, customerInfo, {
        orderId,
        amount: finalPrice - useMileage,
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
