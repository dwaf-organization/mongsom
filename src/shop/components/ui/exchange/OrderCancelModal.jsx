import InnerPaddingSectionWrapper from '../../../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../button';
import { useModal } from '../../../context/ModalContext';
import { cancelOrder } from '../../../api/order';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function OrderCancelModal(orderDetailId, orderId) {
  const { closeModal } = useModal();
  const { addToast } = useToast();
  const { userCode } = useAuth();

  const handleCancel = () => {
    closeModal();
  };
  const handleConfirm = async () => {
    const data = {
      orderDetailId: orderDetailId.orderDetailId,
      orderId: orderDetailId.orderId,
      userCode: userCode,
    };
    const res = await cancelOrder(data);
    if (res.code === -1) {
      addToast(res.data);
      closeModal();
      return;
    }
    addToast('주문 취소가 완료되었습니다.');
    closeModal();

    closeModal();
  };
  return (
    <InnerPaddingSectionWrapper>
      <p className='text-xl px-10 py-10 '>
        [{orderDetailId.productName}] 상품의 주문을 취소하시겠습니까 ?
      </p>
      <div className='flex gap-4 px-8'>
        <Button variant='outline' onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
