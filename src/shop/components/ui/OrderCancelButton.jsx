import React from 'react';

import OrderCancelModal from './exchange/OrderCancelModal';
import { useModal } from '../../context/ModalContext';

export default function OrderCancelButton({ orderId, deliveryStatus }) {
  const { openModal } = useModal();
  const handleOrderCancel = () => {
    if (deliveryStatus !== '결제대기') {
      alert(
        '결제대기 상태에서만 취소가 가능합니다. 교환/반품 신청 또는 고객센터로 문의해주세요.',
      );
      return;
    }
    openModal(<OrderCancelModal orderId={orderId} />);
  };
  return (
    <button
      onClick={handleOrderCancel}
      className='text-sm text-right border border-gray-500 hover:bg-gray-100 rounded-md p-2 w-fit'
    >
      주문취소
    </button>
  );
}
