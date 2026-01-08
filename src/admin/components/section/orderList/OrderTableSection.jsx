import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import { getFirstThumb } from '../../../utils/dateUtils';
import { useState } from 'react';
import { updateDeliveryInfo } from '../../../api/order/index';

export default function OrderTableSection({ rows, loading }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [deliveryDataMap, setDeliveryDataMap] = useState({});
  console.log('🚀 ~ OrderTableSection ~ safeRows:', safeRows);
  const navigate = useNavigate();

  const handleDeliveryDataChange = (orderId, field, value) => {
    setDeliveryDataMap(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleOrderDetail = orderId => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleSaveAll = async () => {
    const deliveryUpdates = Object.entries(deliveryDataMap).map(
      ([orderId, data]) => {
        const order = safeRows.find(row => row.orderId === Number(orderId));
        return {
          orderId: Number(orderId),
          userCode: order?.userCode,
          deliveryStatus: data.deliveryStatus ?? order?.deliveryStatus,
          deliveryCom: '로젠',
          invoiceNum: data.invoiceNum ?? order?.invoiceNum ?? '',
        };
      },
    );

    if (deliveryUpdates.length === 0) {
      alert('변경된 배송 정보가 없습니다.');
      return;
    }

    const response = await updateDeliveryInfo({ deliveryUpdates });
    if (response.code === 1) {
      alert('배송 정보가 저장되었습니다.');
      setDeliveryDataMap({});
    }
  };

  return (
    <section className='py-6'>
      <div className='flex justify-end items-center mt-6 pb-2'>
        <button
          className='bg-primary-200 text-sm p-2 rounded-md text-white'
          onClick={handleSaveAll}
        >
          일괄 저장
        </button>
      </div>
      <div className='overflow-hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 240 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 200 }} />
              <col style={{ width: 120 }} />
            </colgroup>

            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr className='text-center'>
                <th className='px-6 py-3 uppercase tracking-wider'>주문정보</th>
                <th className='px-6 py-3 uppercase tracking-wider'>
                  주문자정보
                </th>

                <th className='px-3 py-3 uppercase tracking-wider text-left'>
                  주문내역
                </th>
                <th className='px-2 py-3 uppercase tracking-wider'>구매금액</th>
                <th className='px-2 py-3 uppercase tracking-wider'>결제상태</th>
                <th className='px-2 py-3 uppercase tracking-wider text-center'>
                  주문상태
                </th>
                <th className='px-6 py-3 uppercase tracking-wider whitespace-nowrap'>
                  상세보기
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y'>
              {!loading && safeRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className='text-center text-sm text-gray-500 py-10'
                  >
                    주문이 없습니다.
                  </td>
                </tr>
              )}

              {safeRows.map(order => {
                const firstItem = order.orderDetails?.[0];
                const restCount = Math.max(0, (order.length || 0) - 1);
                const thumbUrl = getFirstThumb(order);

                return (
                  <tr key={order.orderId} className='text-center'>
                    <td className='px-6 py-3 text-sm text-gray-900'>
                      <div className='flex flex-col gap-1 items-center'>
                        <p className='font-medium'>{order.orderNum}</p>
                        <p className='text-xs text-gray-600'>
                          {formatDate(order.paymentAt)}
                        </p>
                      </div>
                    </td>
                    <td className='px-6 py-3 text-sm text-gray-900'>
                      <div className='flex flex-col gap-1 items-center'>
                        <p className='font-medium'>{order.orderUser}</p>
                        <p className='text-xs text-gray-600'>
                          {order.receivedUserPhone}
                        </p>
                      </div>
                    </td>

                    <td className='px-3 py-3 text-sm text-gray-900'>
                      <div className='flex items-center gap-2'>
                        {order.productInfo.productImgUrl ? (
                          <img
                            src={order.productInfo.productImgUrl}
                            alt={firstItem?.productName || '상품 이미지'}
                            className='h-14 w-14 rounded-md object-cover flex-shrink-0'
                            loading='lazy'
                            referrerPolicy='no-referrer'
                          />
                        ) : (
                          <div className='h-14 w-14 rounded-md bg-gray-100 grid place-items-center text-[11px] text-gray-500 flex-shrink-0'>
                            없음
                          </div>
                        )}

                        <div className='min-w-0 flex-1'>
                          <div
                            className='max-w-[160px] text-left'
                            title={
                              order.productInfo.productName ||
                              firstItem?.name ||
                              undefined
                            }
                          >
                            {order.productInfo.productName || '상품정보 없음'}
                          </div>
                          {restCount > 0 && (
                            <div className='text-gray-600 text-xs text-left'>
                              외 {restCount}개
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {(order.finalPrice ?? 0).toLocaleString()}원
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {order.paymentStatus}
                    </td>

                    <td className='px-6 py-3 text-left text-sm text-gray-900'>
                      <div className='space-y-1.5'>
                        <select
                          name='deliveryStatus'
                          value={
                            deliveryDataMap[order.orderId]?.deliveryStatus ??
                            order.deliveryStatus
                          }
                          className='w-full border border-gray-300 rounded-md px-2 py-1 text-sm'
                          onChange={e =>
                            handleDeliveryDataChange(
                              order.orderId,
                              'deliveryStatus',
                              e.target.value,
                            )
                          }
                        >
                          <option value='전체'>전체</option>
                          <option value='결제대기'>결제대기</option>
                          <option value='결제완료'>결제완료</option>
                          <option value='상품준비중'>상품준비중</option>
                          <option value='배송중'>배송중</option>
                          <option value='배송완료'>배송완료</option>
                          <option value='예약배송'>예약배송</option>
                          <option value='재고부족'>재고부족</option>
                          <option value='입고지연'>입고지연</option>
                        </select>
                        <p className='border rounded-md border-gray-300 px-2 py-1 text-sm'>
                          택배사 : 로젠
                        </p>
                        <input
                          type='text'
                          placeholder='송장번호'
                          value={
                            deliveryDataMap[order.orderId]?.invoiceNum ??
                            order.invoiceNum ??
                            ''
                          }
                          className='border border-gray-400 rounded-md px-1 py-0.5 text-sm w-full'
                          onChange={e =>
                            handleDeliveryDataChange(
                              order.orderId,
                              'invoiceNum',
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>

                    <td className='px-6 py-3 whitespace-nowrap text-sm'>
                      <button
                        className='text-sm cursor-pointer bg-primary-200 text-white px-4 py-2 rounded-lg'
                        onClick={() => handleOrderDetail(order.orderId)}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
