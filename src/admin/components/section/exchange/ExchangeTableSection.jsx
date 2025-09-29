import { useState, Fragment } from 'react';
import { orderList } from '../../../data/OrderList';
import { Button } from '../../ui/button';
import { useSearchParams } from 'react-router-dom';

const COLS = 7;
export default function ExchangeTableSection() {
  const [tab] = useSearchParams();
  const activeTab = tab.get('tab') || 'exchange';
  const [openId, setOpenId] = useState(null);

  return (
    <section>
      <div className='rounded-lg overflow-hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='whitespace-nowrap'>
              <tr>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  주문일
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  주문번호
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  주문자
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  상품정보
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  구매금액
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  교환사유
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider whitespace-nowrap'>
                  상태
                </th>
              </tr>
            </thead>

            <tbody className='divide-y'>
              {orderList.map(order => {
                const isOpen = openId === order.id;
                return (
                  <Fragment key={order.id}>
                    <tr>
                      <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {order.orderDate}
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {order.orderNumber}
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {order.shippingAddress.name}
                      </td>
                      <td className='px-2 py-4 text-sm text-gray-900'>
                        <div className='flex items-center gap-3'>
                          <img
                            className='h-20 w-20 rounded-lg object-cover'
                            src={order.products[0].image}
                            alt={order.products[0].name}
                          />
                          <div className='min-w-0 flex-1'>
                            <div className='font-medium truncate'>
                              {order.products[0].name}
                            </div>
                            {order.products.length > 1 && (
                              <div className='text-gray-500 text-xs'>
                                외 {order.products.length - 1}개 상품
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {order.totalAmount.toLocaleString()}원
                      </td>

                      <td className='px-2 py-4 text-sm text-primary-700'>
                        <button
                          type='button'
                          className='underline'
                          onClick={() => setOpenId(isOpen ? null : order.id)}
                          aria-expanded={isOpen}
                          aria-controls={`row-detail-${order.id}`}
                        >
                          {isOpen ? '상세보기' : '상세보기'}
                        </button>
                      </td>

                      <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-center'>
                        취소
                      </td>
                    </tr>

                    {isOpen && (
                      <tr
                        id={`row-detail-${order.id}`}
                        className='border-y border-gray-400'
                      >
                        <td colSpan={COLS} className='p-0'>
                          <div className='px-6 py-10'>
                            <div className='grid gap-4 md:grid-cols-2 '>
                              이 곳에는 교환 사유가 적혀있습니다 .
                            </div>
                          </div>
                          <div className='flex gap-4 items-center justify-center py-4 border-t border-gray-400'>
                            <Button
                              variant='outline'
                              className='w-fit py-4 px-20 border-gray-500 text-gray-500'
                            >
                              반려
                            </Button>
                            <Button className='w-fit py-4 px-20 '>승인</Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
