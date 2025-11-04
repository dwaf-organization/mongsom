import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderDetailProductInfoSection from '../components/section/mypage/OrderDetailProductInfoSection';
import RecipientInfoSection from '../components/section/mypage/RecipientInfoSection';
import PaymentInfoSection from '../components/section/mypage/PaymentInfoSection';
import { getOrderDetail } from '../api/order';
import BackButton from '../components/ui/BackButton';

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getOrderDetail(id);
        const data = res?.data && typeof res.data === 'object' ? res.data : res;

        if (!cancel) {
          setOrder(data || null);
        }
      } catch (e) {
        console.error('주문 상세 조회 실패:', e);
        if (!cancel) setOrder(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [id]);

  return (
    <InnerPaddingSectionWrapper>
      <BackButton />
      <div className='flex justify-start gap-4 items-center border-b border-gray-500 pb-4'>
        <p className='text-2xl font-semibold text-left'>주문상세</p>
      </div>

      {loading ? (
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      ) : (
        <>
          <OrderDetailProductInfoSection order={order} />
          <RecipientInfoSection order={order} />
          <PaymentInfoSection order={order} />
        </>
      )}
    </InnerPaddingSectionWrapper>
  );
}
