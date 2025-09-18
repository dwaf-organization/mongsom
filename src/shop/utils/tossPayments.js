// utils/tossPayments.js
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { TOSS_PAYMENTS_CONFIG } from '../constants/tossPayments';

let tossPaymentsInstance = null;

export const initializeTossPayments = async () => {
  if (tossPaymentsInstance) return tossPaymentsInstance;

  try {
    if (!TOSS_PAYMENTS_CONFIG.CLIENT_KEY) {
      throw new Error('Toss CLIENT_KEY가 설정되어 있지 않습니다.');
    }
    tossPaymentsInstance = await loadTossPayments(
      TOSS_PAYMENTS_CONFIG.CLIENT_KEY,
    );
    return tossPaymentsInstance;
  } catch (error) {
    console.error('토스페이먼츠 초기화 실패:', error);
    throw new Error(`결제 시스템 초기화 실패: ${error.message}`);
  }
};

/**
 * items: [{ name, price, discountPrice, quantity }]
 * customer: { name, email }
 * override: { orderId?, amount?, successUrl?, failUrl? }
 */
export const createPaymentData = (items = [], customer = {}, override = {}) => {
  // 기본 계산(override.amount가 있으면 그걸 우선 사용)
  const computedAmount = items.reduce((sum, it) => {
    const unit = Number(it.discountPrice ?? it.salePrice ?? it.price ?? 0);
    const qty = Number(it.quantity ?? it.count ?? 1);
    return sum + unit * qty;
  }, 0);

  const amount = Number(override.amount ?? computedAmount);

  if (!Number.isFinite(amount) || amount < 100) {
    throw new Error('결제 금액이 올바르지 않습니다. (최소 100원)');
  }

  const firstName = items[0]?.name ?? items[0]?.productName ?? '상품';
  const orderName =
    items.length > 1 ? `${firstName} 외 ${items.length - 1}개` : firstName;

  // 서버 주문번호가 오면 그걸 사용
  const orderId = String(
    override.orderId ??
      `ORDER_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
  );

  const defaultSuccess = `${window.location.origin}/payment/success?orderId=${encodeURIComponent(orderId)}`;
  const defaultFail = `${window.location.origin}/payment/fail?orderId=${encodeURIComponent(orderId)}`;

  return {
    orderId,
    orderName,
    amount,
    customerName: customer?.name ?? '',
    customerEmail: customer?.email ?? '',
    successUrl: override.successUrl ?? defaultSuccess,
    failUrl: override.failUrl ?? defaultFail,
  };
};

export const openPaymentWidget = async (paymentData, method = '카드') => {
  try {
    const tossPayments = await initializeTossPayments();

    await tossPayments.requestPayment(method, {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderName: paymentData.orderName,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      successUrl: paymentData.successUrl,
      failUrl: paymentData.failUrl,
    });
  } catch (error) {
    // 사용자가 창을 닫은 경우 등은 보통 사용자 취소로 처리
    if (error?.code === 'USER_CANCEL') {
      console.warn('사용자가 결제를 취소했습니다.');
      return;
    }
    console.error('결제 위젯 열기 실패:', error);
    throw error;
  }
};
