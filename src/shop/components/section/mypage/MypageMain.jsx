import OrderDeliveryStatus from '../../ui/mypage/OrderDeliveryStatus';
import OrderListTable from '../../ui/mypage/OrderListTable';
import { getOrderDeliveryStatus } from '../../../api/myPage';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function MypageMain() {
  const [orderDeliveryStatus, setOrderDeliveryStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userCode } = useAuth();
  console.log('🚀 ~ MypageMain ~ userCode:', userCode);

  useEffect(() => {
    let cancelled = false;

    if (!userCode) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = await getOrderDeliveryStatus(userCode);
        if (!cancelled) setOrderDeliveryStatus(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setOrderDeliveryStatus(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userCode]); // ✅ userCode를 의존성에 넣어야 로그인 복원 후 재요청됩니다.

  if (loading) {
    return (
      <section className='pt-10'>
        <p className='text-2xl font-semibold text-left'>회원님, 안녕하세요</p>
        <div className='mt-6 text-gray-500'>로딩 중…</div>
      </section>
    );
  }

  return (
    <section className='pt-10'>
      <p className='text-2xl font-semibold text-left'>회원님, 안녕하세요</p>

      <OrderDeliveryStatus
        orderDeliveryStatus={
          orderDeliveryStatus ?? {
            ready: 0,
            shipping: 0,
            delivered: 0,
            cancelled: 0,
          }
        }
      />
      <OrderListTable />
    </section>
  );
}
