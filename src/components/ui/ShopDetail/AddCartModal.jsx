import { Button } from '../button';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';

export default function AddCartModal() {
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const handleCancel = () => {
    closeModal();
  };

  const handleMoveToCart = () => {
    closeModal();
    navigate('/cart');
  };
  return (
    <>
      <p className='py-11'>상품이 담겼습니다 장바구니로 이동하시겠습니까 ?</p>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant='default'
          onClick={() => {
            handleMoveToCart();
          }}
        >
          장바구니로 이동
        </Button>
      </div>
    </>
  );
}
