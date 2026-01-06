import { Button } from '../button';
import { useModal } from '../../../context/ModalContext';
import { cancelOrder } from '../../../api/order';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function OrderCancelModal(orderId) {
  const { closeModal } = useModal();
  const { addToast } = useToast();
  const { userCode } = useAuth();

  const handleCancel = () => {
    closeModal();
  };
  const handleConfirm = async () => {
    const res = await cancelOrder(orderId.orderId);
    if (res.code === -1) {
      addToast(res.data || '주문 취소에 실패했습니다.', 'error');
      closeModal();

      return;
    } else if (res.code === 1) {
      addToast('주문 취소가 완료되었습니다.', 'success');
    }
    closeModal();
  };

  return (
    <div className='w-[320px] mx-auto bg-white rounded-lg'>
      <div className='flex flex-col items-center text-center px-5 py-6'>
        {/* 경고 아이콘 */}
        <div className='mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
          <svg
            className='w-6 h-6 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
        </div>

        {/* 제목 */}
        <h3 className='text-lg font-bold text-gray-900 mb-2'>주문 취소</h3>

        {/* 메시지 */}
        <p className='text-sm text-gray-600 mb-5 leading-relaxed'>
          상품의 주문을 취소하시겠습니까?
          <br />
          <span className='text-xs text-red-500 mt-1 inline-block'>
            * 취소 후에는 되돌릴 수 없습니다.
          </span>
        </p>

        {/* 버튼 그룹 */}
        <div className='flex gap-2 w-full'>
          <Button
            variant='outline'
            onClick={handleCancel}
            className='flex-1 h-10 text-sm font-medium hover:bg-gray-50 transition-colors'
          >
            돌아가기
          </Button>
          <Button
            onClick={handleConfirm}
            className='flex-1 h-10 text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors'
          >
            취소하기
          </Button>
        </div>
      </div>
    </div>
  );
}
