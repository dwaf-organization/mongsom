import { Button } from '../button';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { useModal } from '../../../context/ModalContext';
import { useToast } from '../../../context/ToastContext';

export default function CheckItemDeleteButton({ cart, updateCart }) {
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();

  const handleDeleteSelected = () => {
    const selectedItems = cart.filter(item => item.checked);
    if (selectedItems.length === 0) {
      addToast('삭제할 상품을 선택해주세요.', 'warning');
      return;
    }

    const modalId = openModal({
      title: '상품 삭제 확인',
      content: (
        <DeleteConfirmModal
          itemCount={selectedItems.length}
          onCancel={() => closeModal(modalId)}
          onConfirm={() => {
            const updatedCart = cart.filter(item => !item.checked);
            updateCart(updatedCart);
            sessionStorage.setItem('cart', JSON.stringify(updatedCart));
            addToast('선택된 상품이 삭제되었습니다.', 'success');
            closeModal(modalId);
          }}
        />
      ),
      size: 'sm',
    });
  };
  return (
    <div className='flex items-center justify-end border-t border-gray-500 py-4 '>
      <Button
        className='text-gray-500 border border-gray-400 px-4 py-2 rounded-lg w-fit'
        variant='outline'
        onClick={handleDeleteSelected}
      >
        선택 상품 삭제
      </Button>
    </div>
  );
}
