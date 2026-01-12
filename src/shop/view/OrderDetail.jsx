import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderDetailProductInfoSection from '../components/section/mypage/OrderDetailProductInfoSection';
import RecipientInfoSection from '../components/section/mypage/RecipientInfoSection';
import PaymentInfoSection from '../components/section/mypage/PaymentInfoSection';
import { getOrderDetail } from '../api/order';
import OrderCancelButton from '../components/ui/OrderCancelButton';
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

        if (!cancel) {
          setOrder(res || null);
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
      <div className='flex items-center w-full  pb-2 md:pb-4'>
        <BackButton />

        <p className='text-lg md:text-2xl font-semibold text-left w-full '>
          주문상세
        </p>
      </div>
      <hr className=' border-gray-500 mx-2 md:mx-0' />

      {loading ? (
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      ) : (
        <>
          <OrderDetailProductInfoSection order={order} />
          <section className='bg-blue-50 rounded-lg my-10 py-6'>
            <p className='text-lg font-semibold text-left border-b border-gray-500 mx-4'>
              무통장 입금 정보
            </p>
            <div className='flex gap-4 pt-6 text-sm'>
              <ul className='flex flex-col gap-4 text-left  px-4'>
                <li>입금계좌</li>
                <li>예금주</li>
                <li>입금 금액</li>
              </ul>
              <ul className='flex flex-col gap-4 text-left px-4'>
                <li>부산은행 113-2019-7400-06 </li>
                <li>주식회사 몽솜</li>
                <li>
                  {Number(order.paymentInfo.finalPrice).toLocaleString()}원
                </li>
              </ul>
            </div>
          </section>
          <RecipientInfoSection order={order} />

          <PaymentInfoSection order={order} />
          <div className='flex justify-end mt-6 mb-10 '>
            {/* <OrderCancelButton
              orderId={order?.orderInfo.orderId}
              deliveryStatus={order?.orderInfo.deliveryStatus}
            /> */}
          </div>
        </>
      )}
    </InnerPaddingSectionWrapper>
  );
}
