import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import { getFirstThumb } from '../../../utils/dateUtils';

export default function OrderTableSection({ rows, loading, page, totalPages }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const navigate = useNavigate();

  // const getFirstThumb = order => {
  //   const first = order?.orderDetails?.[0];
  //   if (!first) return null;
  //   return Array.isArray(first.productImgUrls)
  //     ? first.productImgUrls[0] || null
  //     : first.productImgUrls || null;
  // };

  const handleOrderDetail = orderId => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <section className='py-6'>
      <div className='flex justify-between items-center pb-2'>
        <div className='text-sm text-gray-600'>
          {loading ? '불러오는 중...' : `페이지 ${page} / ${totalPages}`}
        </div>
      </div>

      <div className='overflow-hidden pt-2'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col style={{ width: 160 }} />
              <col style={{ width: 240 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 120 }} />
            </colgroup>

            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr className='text-center'>
                <th className='px-6 py-3 uppercase tracking-wider'>주문정보</th>
                <th className='px-3 py-3 uppercase tracking-wider text-left'>
                  주문내역
                </th>
                <th className='px-6 py-3 uppercase tracking-wider'>구매금액</th>
                <th className='px-6 py-3 uppercase tracking-wider text-left'>
                  배송
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
                    데이터가 없습니다.
                  </td>
                </tr>
              )}

              {safeRows.map(order => {
                const firstItem = order.orderDetails?.[0];
                const restCount = Math.max(
                  0,
                  (order.orderDetails?.length || 0) - 1,
                );
                const thumbUrl = getFirstThumb(order);

                return (
                  <tr key={order.orderId} className='text-center'>
                    <td className='px-6 py-3 text-sm text-gray-900'>
                      <div className='flex flex-col gap-1 items-center'>
                        <p className='font-medium'>{order.orderId}</p>
                        <p className='text-xs text-gray-600'>
                          {formatDate(order.paymentAt)}
                        </p>
                      </div>
                    </td>

                    <td className='px-3 py-3 text-sm text-gray-900'>
                      <div className='flex items-center gap-2'>
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
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
                            className='truncate max-w-[160px] text-left'
                            title={
                              firstItem?.productName ||
                              firstItem?.name ||
                              undefined
                            }
                          >
                            {firstItem?.productName ||
                              firstItem?.name ||
                              '상품정보 없음'}
                          </div>
                          {restCount > 0 && (
                            <div className='text-gray-500 text-sm text-left'>
                              외 {restCount}개
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-3 whitespace-nowrap text-sm text-gray-900'>
                      {(order.finalPrice ?? 0).toLocaleString()}원
                    </td>

                    <td className='px-6 py-3 text-left text-sm text-gray-900'>
                      <div className='space-y-1.5'>
                        <p>상태: {order.deliveryStatus || '-'}</p>
                        <p>택배사: {order.deliveryCom || '-'}</p>
                        <p>송장번호: {order.invoiceNum || '-'}</p>
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
