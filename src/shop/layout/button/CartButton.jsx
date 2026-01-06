import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { addCart } from '../../api/cart';
import { useAuth } from '../../context/AuthContext';
import {
  setInstantPurchase,
  clearInstantPurchase,
} from '../../utils/instantPurchase';

export default function CartButton({ selectedOptions = [], product = {} }) {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { userCode } = useAuth();

  const productId = Number(product.productId ?? product.id);
  const isOptionSelected =
    Array.isArray(selectedOptions) && selectedOptions.length > 0;

  const handleBuy = () => {
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 구매하기 버튼을 눌러주세요.', 'warning');
      return;
    }

    if (!userCode) {
      addToast('로그인이 필요합니다.', 'warning');
      navigate('/login');
      return;
    }

    clearInstantPurchase();

    const productId = Number(product.productId ?? product.id);
    const payload = {
      product: {
        productId,
        name: product.name,
        price: product.price,
        discountPer: product.discountPer,
        discountPrice:
          product.discountPrice ?? product.salePrice ?? product.price,
        productImgUrl:
          product.productImgUrl ??
          product.productImgUrls ??
          product.image ??
          [],
      },
      options: selectedOptions.map(opt => ({
        optId: Number(opt.value ?? opt.optId) || null,
        optName: opt.label ?? opt.optName ?? null,
        quantity: Number(opt.quantity) || 1,
      })),
    };

    setInstantPurchase(payload);

    navigate('/order');
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
          // selectedInfos에서 option1, option2 추출
          const optionIds = (opt.selectedInfos || []).map(
            info => info.optionValueId,
          );
          const payload = {
            userCode,
            productId,
            option1: optionIds[0] ?? null,
            option2: optionIds[1] ?? null,
            quantity: Number(opt.quantity) || 1,
          };
          return addCart(payload);
        }),
      );
      console.log('🚀 ~ handleAddToCart ~ results:', results);

      const ok = results.every(r => r?.code === 1);
      if (ok) addToast('장바구니에 담았습니다.', 'success');
      else addToast('일부 옵션 담기에 실패했습니다.', 'error');
    } catch (e) {
      console.error(e);
      addToast('장바구니 담기 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <>
      <Button
        className='w-full font-bold md:text-xl font-pretendard'
        variant='outline'
        onClick={handleAddToCart}
      >
        장바구니
      </Button>
      <Button
        className='w-full font-bold md:text-xl font-pretendard'
        variant='default'
        onClick={handleBuy}
      >
        구매하기
      </Button>
    </>
  );
}
