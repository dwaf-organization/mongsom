import { orderList } from '../../../data/OrderList';

export default function OrderListTable() {
  return (
    <section>
      <p className='text-xl font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        주문내역 조회
      </p>

      <table className='w-full'>
        <thead>
          <tr>
            <th className='font-montserrat py-4 px-3'>NO</th>
            <th>주문일자</th>
            <th>상품정보/선택옵션</th>
            <th>수량</th>
            <th>주문금액</th>
            <th>배송비</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody className='w-full '>
          {orderList.map(item => (
            <tr key={item.id} className='border-y border-gray-500'>
              <td className='font-montserrat py-4 text-center'>{item.id}</td>
              <td className='font-montserrat py-4 px-3'>{item.orderDate}</td>
              <td className='py-4 pl-14'>
                <div className='flex items-center gap-3'>
                  <img
                    src={item.products[0].image}
                    alt={item.products[0].name}
                    className='w-[80px] h-[80px] object-cover rounded-lg '
                  />
                  <div className='flex flex-col justify-between text-left gap-2'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{item.products[0].name}</p>
                      {item.products.length > 1 && (
                        <p className='text-sm text-gray-600'>
                          외 {item.products.length - 1}개
                        </p>
                      )}
                    </div>
                    <p className='text-sm text-gray-500'>
                      옵션 | {item.products[0].option}
                    </p>
                  </div>
                </div>
              </td>
              <td className='py-4'>
                {item.products.reduce(
                  (total, product) => total + product.quantity,
                  0,
                )}
                개
              </td>
              <td className='font-montserrat py-4'>
                {item.totalAmount.toLocaleString()}원
              </td>
              <td className='text-right font-montserrat py-4'>
                {item.shippingFee.toLocaleString()}원
              </td>
              <td className='py-4 px-3 text-center'>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
