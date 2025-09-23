import { Link } from 'react-router-dom';

import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';
import { useAuth } from '../../../context/AuthContext';
import { getOrderList } from '../../../api/order';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/dateUtils';
import { pickFirstImageUrl } from '../../../utils/dateUtils';

export default function OrderListTab() {
  const { openModal } = useModal();
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
        console.log('🚀 ~ OrderListTab ~ getOrderList:', getOrderList);
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

  const handleOpenModal = orderId => {
    openModal(<DeliveryTrackingModal orderId={orderId} />);
  };

  return (
    <ul>
      {orderList.map(order => {
        const details = Array.isArray(order.details) ? order.details : [];
        const first = details[0] || {};
        const thumb = pickFirstImageUrl(first.productImgUrls);
        const name = first.productName || '-';
        const optName = first.optName || '-';
        const others = Math.max(details.length - 1, 0);
        const qty = details.length || 1;
        const totalAmount = Number(order.finalPrice || 0);

        return (
          <li key={order.orderId} className='border-b border-gray-400 py-4'>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <p className='font-montserrat text-left font-semibold text-lg'>
                  {formatDate(order.paymentAt)}
                </p>

                <button
                  className='text-sm text-gray-50'
                  onClick={() => handleOrderDetail(order.orderId)}
                >
                  주문상세보기
                </button>
              </div>

              <div className='flex items-start gap-4'>
                {thumb ? (
                  <img
                    src={thumb}
                    alt={name}
                    className='w-[100px] h-[100px] object-cover rounded-lg'
                  />
                ) : (
                  <div className='w-[100px] h-[100px] rounded-lg bg-gray-100' />
                )}

                <div className='flex-1'>
                  <p className='text-left text-sm text-gray-500'>
                    주문번호 : {order.orderId}
                  </p>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-gray-900'>{name}</p>
                    {others > 0 && (
                      <span className='text-sm text-gray-500'>
                        외 {others}개
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mb-2 text-left'>
                    옵션: {optName}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='font-semibold'>
                      {totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <button
                    className='border border-gray-500 text-gray-50 rounded-lg px-6 py-1 mt-4 self-center'
                    onClick={() => handleOpenModal(order.orderId)}
                  >
                    배송조회
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
