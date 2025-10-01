import { Button } from './button';
import { useModal } from '../../context/ModalContext';
import { cancelOrder } from '../../api/order';
import { useToast } from '../../context/ToastContext';

export default function OrderCancelModal({ orderDetailId, orderId, userCode }) {
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const handleCancel = () => {
    closeModal();
  };
  const handleConfirm = async () => {
    const data = {
      orderDetailId: orderDetailId,
      orderId: orderId,
      userCode: userCode,
    };
    const res = await cancelOrder(data);
    console.log('확인');
    if (res.code === 1) {
      addToast('주문 취소가 완료되었습니다.');
      closeModal();
    } else {
      addToast(res?.data || '주문 취소에 실패했습니다.', 'error');
      closeModal();
    }
  };
  console.log(
    '🚀 ~ OrderCancelModal ~ orderDetailId, orderId, userCode:',
    orderDetailId,
    orderId,
    userCode,
  );
  return (
    <div className='space-y-4 rounded-lg py-4 px-10'>
      <p className='text-xl font-semibold'>주문 취소</p>
      <p>주문 취소 하시겠습니까?</p>
      <p className='text-sm text-red-500'>
        *주문을 취소후 상태값 변경은 불가능합니다.
        <br /> 주문 취소 진행 후 페이지 새로고침을 해주세요.
      </p>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </div>
  );
}
