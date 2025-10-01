export default function OrderSummarySection({ items }) {
  const totalPrice = items.reduce((sum, item) => {
    const quantity = item.quantity || item.count || 1;
    // salePrice가 있으면 salePrice 사용, 없으면 price 사용
    const itemPrice = item.discountPrice || item.price;
    return sum + itemPrice * quantity;
  }, 0);

  const discount = items.reduce((sum, item) => {
    const quantity = item.quantity || item.count || 1;
    if (item.salePrice) {
      return sum + (item.price - item.salePrice) * quantity;
    }
    return sum;
  }, 0);

  const shippingFee = 3000;

  const finalPrice = totalPrice + shippingFee;

  return (
    <section className='py-10 border-y-2 border-black-100'>
      <h3 className='text-xl text-left font-semibold mb-4 '>결제 정보</h3>
      <ul className='flex flex-col gap-4 border-b border-gray-500 pb-4'>
        <li className='flex justify-between'>
          <p className='text-gray-700 text-xl'>총 주문 금액</p>
          <p className='font-semibold font-montserrat text-xl'>
            {totalPrice.toLocaleString()} won
          </p>
        </li>
        <li className='flex justify-between'>
          <p className='text-gray-700 text-xl'>배송비</p>
          <p className='font-semibold font-montserrat text-xl'>
            + {shippingFee.toLocaleString()} won
          </p>
        </li>
        <li className='flex justify-between'>
          <p className='text-gray-700 text-xl'>할인/부가결제</p>
          <p className='font-semibold font-montserrat text-xl text-primary-200'>
            {discount.toLocaleString()} won
          </p>
        </li>
      </ul>
      <div className='flex justify-between pt-6'>
        <p className='text-gray-700 text-xl font-semibold'>총 결제 금액</p>
        <p className='font-semibold font-montserrat text-xl'>
          {finalPrice.toLocaleString()} won
        </p>
      </div>
    </section>
  );
}
