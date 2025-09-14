import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderSearchSection from '../components/section/orderList/OrderSearchSection';
import OrderTableSection from '../components/section/orderList/OrderTableSection';

export default function OrderList() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>주문조회</h2>
      <OrderSearchSection />
      <OrderTableSection />
    </InnerPaddingSectionWrapper>
  );
}
