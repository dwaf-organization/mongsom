import CartButton from '../../../layout/button/CartButton';
import BuyButton from '../../../layout/button/BuyButton';

export default function PurchaseBar({ onAddToCart }) {
  return (
    <div className='flex justify-between gap-2'>
      <CartButton onClick={onAddToCart} />
      <BuyButton />
    </div>
  );
}
