import Select from '../../ui/Select';
import { orderList } from '../../../data/OrderList';
import { deliveryStatusOptions } from '../../../constants/orderTableSelect';
import { courierOptions } from '../../../constants/orderTableSelect';
import { Button } from '../../ui/button';
import Pencil from '../../../assets/icons/Pencil';

export default function OrderTableSection() {
  return (
    <section className='py-6'>
      {/* <div className='flex justify-start gap-2 mb-4 pt-16'>
        <Button
          variant='outline'
          className=' border-black-100 py-3 text-black-100 w-full max-w-[152px] '
        >
          <Pencil />
          수정
        </Button>
        <Button className='w-full py-3 max-w-[152px] bg-black-100 text-white'>
          삭제
        </Button>
      </div> */}
      <div className='overflow-hidden pt-16'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr>
                <th className='px-4 py-3 text-left  uppercase tracking-wider'>
                  주문일
                </th>
                <th className='px-2 py-3 text-left  uppercase tracking-wider'>
                  주문번호
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider'>
                  주문자
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider'>
                  상품정보
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider'>
                  구매금액
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider'>
                  결제상태
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider'>
                  배송상태
                </th>
                <th className='px-2 py-3 text-left uppercase tracking-wider whitespace-nowrap'>
                  취소/교환/반품
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y '>
              {orderList.map(order => (
                <tr key={order.id}>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {order.orderDate}
                  </td>
                  <td className='px-2 py-4 whitespace-nowrap text-sm  text-gray-900'>
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
                        <div className=' break-words truncate'>
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
                  <td className='px-2 py-4 whitespace-nowrap text-sm  text-gray-900'>
                    {order.totalAmount.toLocaleString()}원
                  </td>
                  <td className='px-2 py-4 whitespace-nowrap'>
                    <span className='text-sm'>{order.status}</span>
                  </td>
                  <td className='px-2 py-4 text-sm text-gray-900'>
                    <div className='flex flex-col space-y-2 max-w-[80px]'>
                      <Select
                        options={deliveryStatusOptions}
                        value={order.status}
                        placeholder='배송상태 선택'
                        className='text-xs'
                        buttonClassName='px-1 py-0 text-xs'
                        dropdownClassName='text-xs'
                        optionClassName=' text-xs'
                      />
                      <Select
                        options={courierOptions}
                        placeholder='택배사 선택'
                        className='text-xs'
                        buttonClassName='py-0 text-xs'
                        dropdownClassName='text-xs'
                        optionClassName='px-2 py-1 text-xs'
                      />
                      <input
                        type='text'
                        placeholder='송장번호'
                        className='w-full px-3 py-0 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        defaultValue={order.trackingNumber || ''}
                      />
                    </div>
                  </td>
                  <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
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
