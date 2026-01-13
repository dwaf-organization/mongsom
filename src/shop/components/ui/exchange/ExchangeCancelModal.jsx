import InnerPaddingSectionWrapper from '../../../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../button';
import { useModal } from '../../../context/ModalContext';
import { deleteChangeOrder } from '../../../api/order';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function ExchangeCancelModal({ orderDetailId }) {
  const { closeModal } = useModal();
  const { addToast } = useToast();
  const { userCode } = useAuth();

  const handleCancel = () => {
    closeModal();
  };
  const handleConfirm = async () => {
    const data = {
      orderDetailId: orderDetailId,
      userCode: userCode,
    };
    const res = await deleteChangeOrder(data);
    console.log('🚀 ~ handleConfirm ~ res:', res);
    if (res.code === 1) {
      addToast('교환/반품 취소가 완료되었습니다.', 'success');
      closeModal();
    }
    if (res.code === -1) {
      addToast(res.data, 'error');
    }
    closeModal();
  };
  return (
    <InnerPaddingSectionWrapper>
      <p className='text-center text-lg md:text-2xl font-semibold px-8  md:px-10 md:py-10 '>
        교환/ 반품 취소
      </p>
      <p className='md:text-2xl px-8 py-4 md:px-10 md:py-10 text-center '>
        교환/ 반품을 취소하시겠습니까 ?
      </p>
      <div className='flex gap-4 px-4 md:px-8'>
        <Button variant='outline' onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
