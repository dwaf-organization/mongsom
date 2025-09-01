import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import {
  AllCheckBoxSection,
  CartItemListSection,
  CartPriceSummarySection,
  BreadCrumbSection,
} from '../components/section/Cart';
import { cart } from '../data/Cart';
import PurchaseBar from '../components/ui/cart/PurchaseBar';

export default function Cart() {
  const allChecked = cart.every(item => item.checked);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-pretendard'>장바구니</h2>

      <BreadCrumbSection />
      <AllCheckBoxSection allChecked={allChecked} />
      <CartItemListSection />
      <CartPriceSummarySection />
      <PurchaseBar />
    </InnerPaddingSectionWrapper>
  );
}
