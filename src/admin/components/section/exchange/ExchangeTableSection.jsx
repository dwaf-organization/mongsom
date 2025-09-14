import Select from '../../ui/Select';
import { orderList } from '../../../data/OrderList';
import { deliveryStatusOptions } from '../../../constants/orderTableSelect';
import { courierOptions } from '../../../constants/orderTableSelect';
import { Button } from '../../ui/button';
import Pencil from '../../../assets/icons/Pencil';

export default function ExchangeTableSection() {
  return (
    <section className='py-6'>
      <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr>
                <th className='px-2 py-3 text-left font-medium  uppercase tracking-wider'>
                  주문일
                </th>
                <th className='px-2 py-3 text-left font-medium  uppercase tracking-wider'>
                  주문번호
                </th>
                <th className='px-2 py-3 text-left font-medium uppercase tracking-wider'>
                  주문자
                </th>
                <th className='px-2 py-3 text-left font-medium0 uppercase tracking-wider'>
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
            <tbody className='bg-white divide-y '>
              {orderList.map(order => (
                <tr key={order.id}>
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
                    <div className='flex items-center space-x-3'>
                      <img
                        className='h-20 w-20 rounded-lg object-cover'
                        src={order.products[0].image}
                        alt={order.products[0].name}
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='font-medium break-words truncate'>
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

                  <td className='px-2 py-4 text-sm text-gray-900'>
                    <span className='text-gray-500'>상세보기</span>
                  </td>
                  <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-center'>
                    취소
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
