import { Button } from './button';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { deleteCart } from '../../api/cart';

export default function DeleteConfirmModal({
  itemCount,
  cart,
  updateCart,
  userCode,
}) {
  const { closeModal } = useModal();
  const { addToast } = useToast();

  const handleDelete = () => {
    closeModal();
  };

  const handleConfirmDelete = async () => {
    const res = await deleteCart(userCode, cart.productId, cart.optId);
    if (res.code === 1) {
      addToast('상품이 삭제되었습니다.', 'success');
      closeModal();
    } else {
      addToast(res?.data || '상품 삭제에 실패했습니다.', 'error');
      closeModal();
    }
    // const updatedCart = cart.filter(item => !item.checked);
    // updateCart(updatedCart);
    // sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    // addToast('선택된 상품이 삭제되었습니다.', 'success');
    // closeModal();
  };

  return (
    <div className='space-y-4 rounded-lg py-10 px-10'>
      <div className='flex items-center justify-center font-semibold'>
        상품 삭제
      </div>
      <p className='text-gray-700'>
        선택된 <span className='font-semibold'>{itemCount}개</span> 상품을
        삭제하시겠습니까?
      </p>
      <div className='flex justify-between gap-2 pt-4'>
        <Button
          variant='outline'
          onClick={handleDelete}
          className='border-gray-500 text-gray-50'
        >
          취소
        </Button>
        <Button onClick={handleConfirmDelete} className=''>
          삭제
        </Button>
      </div>
    </div>
  );
}
