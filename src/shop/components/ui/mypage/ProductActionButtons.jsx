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
  console.log('🚀 ~ ProductActionButtons ~ changeStatus:', changeStatus);
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

  // 버튼을 모두 숨겨야 하는 상태들 (교환/반품 진행중이거나 완료된 상태)
  const hiddenStatuses = [
    '교환중',
    '반품중',
    '교환완료',
    '반품완료',
    '교환승인',
    '반품승인',
  ];
  // changeStatus가 배열일 수도 있고 문자열일 수도 있음
  const statusValue = Array.isArray(changeStatus)
    ? (changeStatus[0]?.trim?.() ?? changeStatus[0])
    : (changeStatus?.trim?.() ?? changeStatus);
  const isHiddenStatus = hiddenStatuses.includes(statusValue);
  const hasChangeStatus = statusValue != null && statusValue !== '';

  console.log('🚀 ~ ProductActionButtons ~ statusValue:', statusValue);
  console.log('🚀 ~ ProductActionButtons ~ isHiddenStatus:', isHiddenStatus);
  console.log('🚀 ~ ProductActionButtons ~ hasChangeStatus:', hasChangeStatus);

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
    <div className='flex flex-col text-xs gap-2 items-end'>
      {changeStatus == null ||
      changeStatus === '' ||
      changeStatus === undefined ||
      changeStatus.length === 0 ? (
        <p className='text-right text-gray-500'>{deliveryStatus}</p>
      ) : (
        <p className='text-right text-gray-500'>{changeStatus}</p>
      )}
      {/* 결제 대기 상태가 아닐 때만 배송조회 버튼 표시 */}
      {!isNotDelivered && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg px-2 md:px-6 py-2 w-[90px] md:w-[120px]'
          onClick={handleDeliveryTracking}
        >
          배송조회
        </button>
      )}
      {/* 교환/반품 취소 버튼 - hiddenStatus가 아니고 changeStatus가 있을 때 표시 */}
      {!isHiddenStatus && hasChangeStatus && (
        <button
          className='border border-gray-500 text-gray-50 rounded-lg px-2 md:px-6 py-2 w-[90px] md:w-[120px]'
          onClick={() => handleReturnOrExchangeCancel(orderDetailId)}
        >
          교환/반품 취소
        </button>
      )}
      {/* 교환, 반품 신청 버튼 - hiddenStatus가 아니고 changeStatus가 없을 때 표시 */}
      {!isHiddenStatus &&
        !hasChangeStatus &&
        (exchangeAbleStatus || isNotDelivered) && (
          <button
            className='border border-gray-500 text-gray-50 rounded-lg whitespace-nowrap px-2 md:px-6 py-2 w-[90px] md:w-[120px]'
            onClick={handleExchange}
          >
            교환, 반품 신청
          </button>
        )}
      {/* 주문취소 버튼 - 결제 대기 상태일 때만 표시 */}
      {/* 리뷰 작성 버튼 - 배송완료 상태일 때만 표시 */}
      {deliveryStatus === '배송완료' && (
        <button
          className='border border-gray-500 md:base whitespace-nowrap text-gray-50 rounded-lg px-2 md:px-6 py-2 w-[90px] md:w-[120px]'
          onClick={handleReview}
        >
          리뷰 작성하기
        </button>
      )}
    </div>
  );
}
