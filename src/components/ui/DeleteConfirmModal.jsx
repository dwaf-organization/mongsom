import { Button } from './button';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

export default function DeleteConfirmModal({ itemCount, cart, updateCart }) {
  const { closeModal } = useModal();
  const { addToast } = useToast();

  const handleDelete = () => {
    closeModal();
  };

  const handleConfirmDelete = () => {
    const updatedCart = cart.filter(item => !item.checked);
    updateCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    addToast('선택된 상품이 삭제되었습니다.', 'success');
    closeModal();
  };

  return (
    <div className='space-y-4 rounded-lg py-10 px-10'>
      <p className='text-gray-700'>
        선택된 <span className='font-semibold'>{itemCount}개</span> 상품을
        삭제하시겠습니까?
      </p>
      <div className='flex justify-center gap-3'>
        <Button variant='outline' onClick={handleDelete} className='w-fit px-8'>
          취소
        </Button>
        <Button onClick={handleConfirmDelete} className='w-fit px-8'>
          삭제
        </Button>
      </div>
    </div>
  );
}
