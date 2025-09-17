import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { addCart } from '../../api/cart';
import { useAuth } from '../../context/AuthContext';

export default function CartButton({ selectedOptions = [], product = {} }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const productId = Number(product.productId ?? product.id);
  const { userCode } = useAuth();

  const isOptionSelected =
    Array.isArray(selectedOptions) && selectedOptions.length > 0;

  const handleBuy = () => {
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 구매하기 버튼을 눌러주세요.', 'warning');
      return;
    }

    const items = selectedOptions.map(opt => ({
      productId,
      optId: Number(opt.value ?? opt.optId),
      quantity: Number(opt.quantity) || 1,
    }));
    navigate('/order', { state: { items } });
  };

  const handleAddToCart = async () => {
    if (!userCode) {
      addToast('로그인이 필요합니다.', 'warning');
      navigate('/login');
      return;
    }
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 장바구니에 추가해주세요.', 'warning');
      return;
    }

    try {
      const results = await Promise.all(
        selectedOptions.map(opt => {
          const payload = {
            userCode,
            optId: Number(opt.value ?? opt.optId),
            productId,
            quantity: Number(opt.quantity) || 1,
            checkStatus: true,
          };
          return addCart(payload);
        }),
      );

      const ok = results.every(r => r?.code === 1);
      if (ok) {
        addToast('장바구니에 담았습니다.', 'success');
      } else addToast('일부 옵션 담기에 실패했습니다.', 'error');
    } catch (e) {
      console.error(e);
      addToast('장바구니 담기 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <>
      <Button
        className='w-full font-bold text-xl font-pretendard'
        variant='outline'
        onClick={handleAddToCart}
      >
        장바구니
      </Button>
      <Button
        className='w-full font-bold text-xl font-pretendard'
        variant='default'
        onClick={handleBuy}
      >
        구매하기
      </Button>
    </>
  );
}
