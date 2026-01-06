import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';
import { useAuth } from '../../../context/AuthContext';
import { getOrderList } from '../../../api/order';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/dateUtils';
import Pagination from '../Pagination';

export default function OrderListTab() {
  const { openModal } = useModal();
  const { userCode } = useAuth();
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 0;

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
        const response = await getOrderList(userCode, page);
        console.log('🚀 ~ OrderListTab ~ page:', page);
        console.log('🚀 ~ OrderListTab ~ response:', response);
        const list = Array.isArray(response.orders) ? response.orders : [];

        if (!cancel) {
          setOrderList(list);
          setPagination(response.pagination);
        }
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
  }, [userCode, page]);

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
        const name = order.productInfo.productName || '-';
        const option1Name = order.productInfo.option1Name || '';
        const option2Name = order.productInfo.option2Name || '';
        const optionText =
          [option1Name, option2Name].filter(Boolean).join(', ') || '-';
        const totalAmount = Number(order.finalPrice || 0);
        const productImgUrl = order.productInfo.productImgUrl;

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
                {productImgUrl ? (
                  <img
                    src={productImgUrl}
                    alt={name}
                    className='w-[100px] h-[100px] object-cover rounded-lg'
                  />
                ) : (
                  <div className='w-[100px] h-[100px] rounded-lg bg-gray-100' />
                )}

                <div className='flex-1'>
                  <p className='text-left text-sm text-gray-500'>
                    주문번호 : {order.orderNum || order.orderId}
                  </p>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-gray-900 truncate max-w-[5rem] xl:max-w-[300px]'>
                      {name}
                    </p>
                  </div>
                  <p className='text-sm text-gray-600 mb-2 text-left truncate max-w-[5rem] xl:max-w-[300px]'>
                    옵션: {optionText}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='font-semibold'>
                      {totalAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className='flex flex-col items-end '>
                  <p className='text-sm text-gray-500'>
                    {order.deliveryStatus}
                  </p>
                  <button
                    className='border border-gray-500 text-gray-50 rounded-lg px-1 md:px-6 py-1 mt-4 self-center text-xs md:text-base'
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

      <Pagination totalPage={pagination.totalPage} />
    </ul>
  );
}
