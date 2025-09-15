import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';

export default function ProductActionButtons({ product, orderId }) {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleReview = () => {
    navigate(`/create-review/${product.id}`);
  };

  const handleExchange = () => {
    console.log('handleExchange orderId:', orderId);
    navigate(`/exchange/${orderId}`);
  };

  const handleDeliveryTracking = () => {
    openModal(<DeliveryTrackingModal orderId={orderId} />);
  };

  return (
    <div className='flex flex-col text-sm gap-2'>
      <button
        className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
        onClick={handleDeliveryTracking}
      >
        배송조회
      </button>
      <button
        className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
        onClick={handleExchange}
      >
        교환, 반품 신청
      </button>
      <button
        className='border border-gray-500 text-gray-50 rounded-lg px-6 py-2'
        onClick={handleReview}
      >
        리뷰 작성하기
      </button>
    </div>
  );
}
