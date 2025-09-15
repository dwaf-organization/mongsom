import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function CartButton({ selectedOptions, product }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isOptionSelected = selectedOptions && selectedOptions.length > 0;

  const handleBuy = () => {
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 구매하기 버튼을 눌러주세요.', 'warning');
      return;
    }

    const purchaseItems = selectedOptions.map(option => ({
      id: Date.now() + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price, // 항상 원가 저장
      image: product.image,
      option: option.name,
      quantity: option.quantity,
      count: option.quantity,
      selectedOptions: selectedOptions,
      salePrice: product.salePrice, // 할인가 저장
      saleRate: product.saleRate,
      checked: true,
    }));

    sessionStorage.setItem('purchaseItems', JSON.stringify(purchaseItems));

    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const updatedCart = existingCart.filter(item => !item.checked);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));

    navigate('/order');
  };

  const handleAddToCart = () => {
    if (!isOptionSelected) {
      addToast('상품 옵션을 선택한 후 장바구니에 추가해주세요.', 'warning');
      return;
    }

    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');

    const newCartItems = selectedOptions.map(option => ({
      id: Date.now() + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price, // 항상 원가 저장
      image: product.image,
      option: option.name,
      count: option.quantity,
      selectedOptions: selectedOptions,
      salePrice: product.salePrice, // 할인가 저장
      saleRate: product.saleRate,
      checked: true,
    }));

    const updatedCart = [...existingCart, ...newCartItems];
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    addToast('장바구니에 추가되었습니다.', 'success');
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
