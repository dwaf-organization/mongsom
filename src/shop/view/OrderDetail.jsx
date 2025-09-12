import { useParams } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { orderList } from '../data/OrderList';
import OrderDetailProductInfoSection from '../components/section/mypage/OrderDetailProductInfoSection';
import RecipientInfoSection from '../components/section/mypage/RecipientInfoSection';
import PaymentInfoSection from '../components/section/mypage/PaymentInfoSection';

export default function OrderDetail() {
  const { id } = useParams();

  const order = orderList.find(order => order.id === parseInt(id));

  return (
    <InnerPaddingSectionWrapper>
      <p className='text-2xl font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        주문상세
      </p>
      <OrderDetailProductInfoSection order={order} />
      <RecipientInfoSection />
      <PaymentInfoSection />
    </InnerPaddingSectionWrapper>
  );
}
