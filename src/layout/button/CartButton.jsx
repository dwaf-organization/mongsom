import { Button } from '../../components/ui/button';
import { useToast } from '../../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartButton({ selectedOptions, product }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleBuy = () => {
    if (selectedOptions.length === 0) {
      addToast('옵션을 선택해주세요.', 'warning');
      return;
    }

    navigate('/order');
  };

  const handleAddToCart = () => {
    if (selectedOptions.length === 0) {
      addToast('옵션을 선택해주세요.', 'warning');
      return;
    }

    const existingCart = JSON.parse(sessionStorage.getItem('cart') || '[]');

    const newCartItems = selectedOptions.map(option => ({
      id: Date.now() + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      option: option.name,
      count: option.quantity,
      selectedOptions: selectedOptions,
      salePrice: product.salePrice,
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
      <Link to='/order' className='w-full'>
        <Button
          className=' font-bold text-xl font-pretendard'
          variant='default'
          onClick={handleBuy}
        >
          구매하기
        </Button>
      </Link>
    </>
  );
}
