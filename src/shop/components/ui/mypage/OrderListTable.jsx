import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getOrderList } from '../../../api/order';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import { pickFirstImageUrl } from '../../../utils/dateUtils';

export default function OrderListTable() {
  const { userCode } = useAuth();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleOrderDetail = orderId => {
    navigate(`/order-detail/${orderId}`);
  };

  useEffect(() => {
    if (!userCode) {
      setOrderList([]);
      setLoading(false);
      return;
    }

    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getOrderList(userCode);
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data?.items)
              ? data.data.items
              : [];
        if (!cancel) setOrderList(list);
      } catch (e) {
        console.error('주문 리스트 조회 실패:', e);
        if (!cancel) setOrderList([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [userCode]);

  if (loading) {
    return (
      <section className='pt-10'>
        <p className='text-xl font-semibold text-left border-b border-gray-500 pb-4'>
          주문내역 조회
        </p>
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      </section>
    );
  }

  if (!orderList.length) {
    return (
      <section className='pt-10'>
        <p className='text-xl font-semibold text-left border-b border-gray-500 pb-4'>
          주문내역 조회
        </p>
        <div className='py-6 text-center text-gray-500'>
          주문 내역이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className='pt-10'>
      <p className='text-xl font-semibold text-left border-b border-gray-500 pb-4'>
        주문내역 조회
      </p>

      <table className='w-full'>
        <thead>
          <tr>
            <th className='py-4 px-3'>NO</th>
            <th className='text-center'>주문일자</th>
            <th className='text-center'>상품정보/선택옵션</th>
            <th className='text-center'>주문금액</th>
            <th className='text-right'>배송비</th>
            <th className='text-center'>상태</th>
          </tr>
        </thead>

        <tbody className='w-full'>
          {orderList.map(order => {
            const details = Array.isArray(order.details) ? order.details : [];
            const first = details[0] || {};
            const thumb = pickFirstImageUrl(first.productImgUrls);
            const name = first.productName || '-';
            const opt = first.optName ? `옵션 | ${first.optName}` : '옵션 | -';
            const shippingFee = 3000;

            return (
              <tr
                key={order.orderId}
                className='border-y border-gray-500 px-3 cursor-pointer'
                onClick={() => handleOrderDetail(order.orderId)}
              >
                <td className='font-montserrat py-4 text-center'>
                  {order.orderId}
                </td>
                <td className='font-montserrat py-4 px-3 text-center'>
                  {formatDate(order.paymentAt)}
                </td>

                <td className='py-4 pl-14 max-w-[250px] truncate'>
                  <div className='flex items-center gap-3'>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={name}
                        className='w-[80px] h-[80px] object-cover rounded-lg'
                      />
                    ) : (
                      <div className='w-[80px] h-[80px] rounded-lg bg-gray-100' />
                    )}
                    <div className='flex flex-col justify-between text-left gap-2'>
                      <div className='flex items-center gap-2'>
                        <p className='font-medium truncate'>{name}</p>
                        {details.length > 1 && (
                          <p className='text-sm text-gray-600'>
                            외 {details.length - 1}개
                          </p>
                        )}
                      </div>
                      <p className='text-sm text-gray-500'>{opt}</p>
                    </div>
                  </div>
                </td>

                <td className='font-montserrat py-4 text-center'>
                  {Number(order.finalPrice || 0).toLocaleString()}원
                </td>
                <td className='text-right font-montserrat py-4'>
                  {Number(shippingFee).toLocaleString()}원
                </td>
                <td className='py-4 px-3 text-center'>
                  {order.deliveryStatus || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
