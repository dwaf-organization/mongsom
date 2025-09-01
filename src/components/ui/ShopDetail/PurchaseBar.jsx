import CartButton from '../../../layout/button/CartButton';
import BuyButton from '../../../layout/button/BuyButton';

export default function PurchaseBar() {
  return (
    <div className='flex justify-between gap-2'>
      <CartButton />
      <BuyButton />
    </div>
  );
}
