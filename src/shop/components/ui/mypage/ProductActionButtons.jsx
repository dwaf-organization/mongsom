import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';
import ExchangeCancelModal from '../exchange/ExchangeCancelModal';
import OrderCancelModal from '../exchange/OrderCancelModal';

export default function ProductActionButtons({
  product,
  orderId,
  changeStatus,
  orderDetailId,
  deliveryStatus,
  orderStatus,
}) {
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

  const handleReview = () => navigate(`/create-review/${product?.id}`);

  const handleExchange = () => navigate(`/exchange/${orderId}`);

  const handleDeliveryTracking = () =>
    openModal(<DeliveryTrackingModal orderId={orderId} />);

  const handleReturnOrExchangeCancel = odid =>
    openModal(<ExchangeCancelModal orderDetailId={odid} orderId={orderId} />);

  return (
    <div className='flex flex-col text-sm gap-2'>
      <button
        className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
        onClick={handleDeliveryTracking}
      >
        배송조회
      </button>

      {isShippedOrDelivered && (
        <>
          {hasReturnCancel && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
            >
              반품취소
            </button>
          )}

          {hasExchangeCancel && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
            >
              교환취소
            </button>
          )}

          {!hasAnyChange && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={handleExchange}
            >
              교환, 반품 신청
            </button>
          )}
        </>
      )}

      {!isPreShipping && !isShippedOrDelivered && (
        <>
          {hasReturnCancel && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
            >
              반품취소
            </button>
          )}
          {hasExchangeCancel && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
            >
              교환취소
            </button>
          )}
          {!hasAnyChange && (
            <button
              className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
              onClick={handleExchange}
            >
              교환, 반품 신청
            </button>
          )}
        </>
      )}

      <button
        className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
        onClick={handleReview}
      >
        리뷰 작성하기
      </button>
    </div>
  );
}
