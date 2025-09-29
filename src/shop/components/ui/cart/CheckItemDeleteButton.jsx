import { Button } from '../button';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { useModal } from '../../../context/ModalContext';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function CheckItemDeleteButton({ cart, updateCart }) {
  const { addToast } = useToast();
  const { openModal } = useModal();
  const { userCode } = useAuth();

  const handleDeleteSelected = () => {
    const selectedItems = cart.filter(item => item.checkStatus);
    if (selectedItems.length === 0) {
      addToast('삭제할 상품을 선택해주세요.', 'warning');
      return;
    }

    openModal(
      <DeleteConfirmModal
        userCode={userCode}
        itemCount={selectedItems.length}
        cart={cart}
        updateCart={updateCart}
      />,
    );
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
