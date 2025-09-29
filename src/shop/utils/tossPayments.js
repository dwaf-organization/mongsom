// utils/tossPayments.js
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { TOSS_PAYMENTS_CONFIG } from '../constants/tossPayments';

let tossPaymentsInstance = null;
let inFlight = false;

export const initializeTossPayments = async () => {
  if (tossPaymentsInstance) return tossPaymentsInstance;
  if (!TOSS_PAYMENTS_CONFIG?.CLIENT_KEY) {
    throw new Error('Toss CLIENT_KEY가 설정되어 있지 않습니다.');
  }
  tossPaymentsInstance = await loadTossPayments(
    TOSS_PAYMENTS_CONFIG.CLIENT_KEY,
  );
  return tossPaymentsInstance;
};

/**
 * items: [{ name, price, discountPrice, quantity }]
 * customer: { name, email }
 * override: { orderId(필수), amount?, successUrl?, failUrl? }
 */
export const createPaymentData = (items = [], customer = {}, override = {}) => {
  if (!override?.orderId) {
    throw new Error(
      'orderId가 없습니다. 서버에서 발급받은 orderId를 전달하세요.',
    );
  }
  const computedAmount = items.reduce((sum, it) => {
    const unit = Number(it.discountPrice ?? it.salePrice ?? it.price ?? 0);
    const qty = Number(it.quantity ?? it.count ?? 1);
    return sum + unit * qty;
  }, 0);
  const amount = Number(override.amount ?? computedAmount);
  if (!Number.isFinite(amount) || amount < 100) {
    throw new Error('결제 금액이 올바르지 않습니다. (최소 100원)');
  }
  const firstName =
    items[0]?.name ?? items[0]?.productName ?? items[0]?.title ?? '상품';
  const orderName =
    items.length > 1 ? `${firstName} 외 ${items.length - 1}개` : firstName;

  const orderId = String(override.orderId);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const defaultSuccess = `${origin}/payment/success?orderId=${encodeURIComponent(orderId)}`;
  const defaultFail = `${origin}/payment/fail?orderId=${encodeURIComponent(orderId)}`;

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
  if (inFlight) {
    console.warn('결제 진행 중입니다.');
    return;
  }
  inFlight = true;
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
    if (error?.code === 'USER_CANCEL') {
      console.warn('사용자가 결제를 취소했습니다.');
      return;
    }
    console.error('결제 위젯 열기 실패:', error);
    throw error;
  } finally {
    inFlight = false;
  }
};
