import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderSearchSection from '../components/section/orderList/OrderSearchSection';
import OrderTableSection from '../components/section/orderList/OrderTableSection';

export default function OrderList() {
  const sortOptions = [
    { value: 'order', label: '최신순' },
    { value: 'payments', label: '인기순' },
    { value: 'delivery', label: '리뷰많은순' },
  ];
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl text-gray-900 mb-6'>주문조회</h2>
      <OrderSearchSection />
      <OrderTableSection />
    </InnerPaddingSectionWrapper>
  );
}
