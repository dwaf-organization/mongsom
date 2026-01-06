import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';
import ExchangeCancelModal from '../exchange/ExchangeCancelModal';
import OrderCancelModal from '../exchange/OrderCancelModal';
import { de } from 'zod/v4/locales/index.cjs';

export default function ProductActionButtons({
  product,
  orderId,
  changeStatus,
  orderDetailId,
  deliveryStatus,
  orderStatus,
}) {
  console.log('🚀 ~ ProductActionButtons ~ deliveryStatus:', deliveryStatus);

  const navigate = useNavigate();
  const { openModal } = useModal();

  const statuses = Array.isArray(changeStatus)
    ? changeStatus.map(v => Number(v)).filter(v => !Number.isNaN(v))
    : changeStatus != null
      ? [Number(changeStatus)].filter(v => !Number.isNaN(v))
      : [];

  const orderStatuses = Array.isArray(orderStatus)
    ? orderStatus.map(v => Number(v)).filter(v => !Number.isNaN(v))
    : orderStatus != null
      ? [Number(orderStatus)].filter(v => !Number.isNaN(v))
      : [];

  const hasExchangeCancel = statuses.includes(1);
  const hasReturnCancel = statuses.includes(2);
  const hasAnyChange = hasExchangeCancel || hasReturnCancel;

  const isPreShipping =
    deliveryStatus === '결제완료' || deliveryStatus === '상품준비중';
  const isShippedOrDelivered =
    deliveryStatus === '결제완료' || deliveryStatus === '결제완료';

  const isPrePaymentStatus =
    deliveryStatus === '결제 대기' || deliveryStatus === '결제대기';

  const exchangeAbleStatus =
    deliveryStatus === '배송중' || deliveryStatus === '배송완료';

  const isNotDelivered =
    deliveryStatus === '결제대기' ||
    deliveryStatus === '결제완료' ||
    deliveryStatus === '상품준비중';

  const handleReview = () =>
    navigate(`/create-review/${product?.orderDetailId}`);

  const handleExchange = () => navigate(`/exchange/${orderId}`);

  const handleDeliveryTracking = () =>
    openModal(<DeliveryTrackingModal orderId={orderId} />);

  const handleReturnOrExchangeCancel = odid =>
    openModal(<ExchangeCancelModal orderDetailId={odid} orderId={orderId} />);

  return (
    <div className='flex flex-col text-sm gap-2'>
      <p className='text-right text-gray-500'>{deliveryStatus}</p>
      {/* 결제 대기 상태가 아닐 때만 배송조회 버튼 표시 */}
      {!isNotDelivered && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg md:px-6 py-2'
          onClick={handleDeliveryTracking}
        >
          배송조회
        </button>
      )}
      {/* 교환/반품 취소 버튼들 */}
      {hasReturnCancel && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg px-2 md:px-6 py-2'
          onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
        >
          반품취소
        </button>
      )}
      {hasExchangeCancel && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg px-2 md:px-6 py-2'
          onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
        >
          교환취소
        </button>
      )}
      {/* 교환, 반품 신청 버튼 - exchangeAbleStatus 또는 isNotDelivered 상태일 때 표시 */}
      {!hasAnyChange && (exchangeAbleStatus || isNotDelivered) && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg px-2 md:px-6 py-2'
          onClick={handleExchange}
        >
          교환, 반품 신청
        </button>
      )}
      {/* 주문취소 버튼 - 결제 대기 상태일 때만 표시 */}
      {/* 리뷰 작성 버튼 - 배송완료 상태일 때만 표시 */}
      {deliveryStatus === '배송완료' && (
        <button
          className='border border-gray-500 text-sm md:base whitespace-nowrap text-gray-50 rounded-lg px-2 md:px-6 py-2'
          onClick={handleReview}
        >
          리뷰 작성하기
        </button>
      )}

      <button className='text-xs text-right'>주문취소</button>
    </div>
  );
}
