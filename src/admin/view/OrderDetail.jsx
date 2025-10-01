import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderInfo from '../components/section/orderDetail/OrderInfo';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOrderDetail } from '../api/order';
import OrderStatus from '../components/section/orderDetail/OrderStatus';
import OrderProductInfo from '../components/section/orderDetail/OrderProductInfo';
import OrderPaymentInfo from '../components/section/orderDetail/OrderPaymentInfo';
import OrderReceivedInfo from '../components/section/orderDetail/OrderReceivedInfo';

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchOrderDetail = async () => {
      const response = await getOrderDetail(id);
      console.log(response);
      if (response.code === 1) {
        setOrder(response.data);
        setLoading(false);
      } else {
        setOrder(null);
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);
  if (loading) {
    return (
      <InnerPaddingSectionWrapper>
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      </InnerPaddingSectionWrapper>
    );
  }

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>주문상세</h2>

      <OrderInfo order={order} />
      <OrderStatus order={order} />
      <OrderProductInfo order={order} />
      <OrderPaymentInfo order={order} />
      <OrderReceivedInfo order={order} />
    </InnerPaddingSectionWrapper>
  );
}
