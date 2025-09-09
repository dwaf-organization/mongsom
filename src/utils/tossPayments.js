import { loadTossPayments } from '@tosspayments/payment-sdk';
import { TOSS_PAYMENTS_CONFIG } from '../constants/tossPayments';

let tossPaymentsInstance = null;

export const initializeTossPayments = async () => {
  if (tossPaymentsInstance) {
    console.log('기존 토스페이먼츠 인스턴스 사용');
    return tossPaymentsInstance;
  }

  try {
    console.log('토스페이먼츠 초기화 시작...');
    console.log('클라이언트 키:', TOSS_PAYMENTS_CONFIG.CLIENT_KEY);

    tossPaymentsInstance = await loadTossPayments(
      TOSS_PAYMENTS_CONFIG.CLIENT_KEY,
    );

    console.log('토스페이먼츠 초기화 성공:', tossPaymentsInstance);
    return tossPaymentsInstance;
  } catch (error) {
    console.error('토스페이먼츠 초기화 실패:', error);
    console.error('오류 상세:', error.message);
    console.error('오류 스택:', error.stack);
    throw new Error(`결제 시스템을 불러오는데 실패했습니다: ${error.message}`);
  }
};

export const openPaymentWidget = async paymentData => {
  try {
    const tossPayments = await initializeTossPayments();

    console.log('결제 요청 시작...');
    console.log('결제 데이터:', paymentData);

    const paymentRequest = {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderName: paymentData.orderName,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      successUrl: paymentData.successUrl,
      failUrl: paymentData.failUrl,
    };

    console.log('결제 요청 객체:', paymentRequest);

    await tossPayments.requestPayment('카드', paymentRequest);

    console.log('결제 요청 성공');
  } catch (error) {
    console.error('결제 위젯 열기 실패:', error);
    console.error('오류 상세:', error.message);
    console.error('오류 코드:', error.code);
    console.error('오류 타입:', typeof error);
    console.error('오류 속성들:', Object.keys(error));
    throw error;
  }
};

export const createPaymentData = (selectedItems, customerInfo) => {
  // OrderSummarySection과 동일한 계산 로직 적용
  const totalPrice = selectedItems.reduce((sum, item) => {
    const quantity = item.quantity || item.count || 1;
    // salePrice가 있으면 salePrice 사용, 없으면 price 사용
    const itemPrice = item.salePrice || item.price;
    return sum + itemPrice * quantity;
  }, 0);

  const discount = selectedItems.reduce((sum, item) => {
    const quantity = item.quantity || item.count || 1;
    if (item.salePrice) {
      return sum + (item.price - item.salePrice) * quantity;
    }
    return sum;
  }, 0);

  const shippingFee = totalPrice < 50000 ? 3000 : 0;
  const finalPrice = totalPrice + shippingFee;

  console.log('선택된 상품들:', selectedItems);
  console.log('총 주문 금액:', totalPrice);
  console.log('할인 금액:', discount);
  console.log('배송비:', shippingFee);
  console.log('최종 결제 금액:', finalPrice);

  // 최소 금액 체크 (토스페이먼츠는 최소 100원 이상이어야 함)
  if (finalPrice < 100) {
    throw new Error('결제 금액이 너무 적습니다. 최소 100원 이상이어야 합니다.');
  }

  return {
    amount: finalPrice, // finalPrice 사용
    orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    orderName:
      selectedItems.length === 1
        ? selectedItems[0].name
        : `${selectedItems[0].name} 외 ${selectedItems.length - 1}개`,
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
  };
};
