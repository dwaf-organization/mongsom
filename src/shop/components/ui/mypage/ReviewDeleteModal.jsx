import { useModal } from '../../../context/ModalContext';
import { useToast } from '../../../context/ToastContext';
import { deleteReview } from '../../../api/review';
import { Button } from '../button';

export default function ReviewDeleteModal({ reviewId, userCode }) {
  const { closeModal } = useModal();
  const { addToast } = useToast();

  const handleDelete = async () => {
    const res = await deleteReview(reviewId, userCode);
    if (res.code === -1) {
      addToast('리뷰 삭제에 실패했습니다.', 'error');
      closeModal();
      return;
    }
    if (res.code === 1) {
      addToast('리뷰가 삭제되었습니다.', 'success');
      closeModal();
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className='space-y-4 rounded-lg py-10 px-10'>
      <div className='flex items-center justify-center font-semibold text-xl'>
        리뷰 삭제
      </div>
      <p className='text-lg text-center'>리뷰를 삭제하시겠습니까?</p>
      <p className='text-red-500'>* 리뷰를 삭제하면 재작성 할 수 없습니다.</p>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleDelete} variant='outline'>
          삭제
        </Button>
      </div>
    </div>
  );
}
