import { deleteProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';
import { useModal } from '../../../context/ModalContext';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';

export default function ProductDeleteModal({ productId, onDeleted }) {
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const res = await deleteProduct(productId);
    if (res?.code === 1) {
      onDeleted?.(productId); // 부모에게 "지웠다" 알림
      addToast('상품이 삭제되었습니다.', 'success');
      closeModal();
    } else {
      addToast(res?.data || '상품 삭제에 실패했습니다.', 'error');
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className='space-y-4 rounded-lg py-10 px-10'>
      <h1>상품을 삭제하시겠습니까 ?</h1>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleDelete} variant='outline'>
          삭제
        </Button>
      </div>
    </div>
  );
}
