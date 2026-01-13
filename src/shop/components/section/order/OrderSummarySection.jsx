export default function OrderSummarySection({ items, useMileage = 0 }) {
  const calcItemPrice = item => {
    if (item.totalPrice !== undefined) {
      return Number(item.totalPrice);
    }
    const unitPrice = Number(
      item.unitPrice ?? item.discountPrice ?? item.price ?? 0,
    );
    return unitPrice * Number(item.quantity ?? 1);
  };

  const totalPrice = items.reduce((sum, item) => sum + calcItemPrice(item), 0);

  const discount = items.reduce((sum, item) => {
    const quantity = Number(item.quantity ?? 1);
    const basePrice = Number(item.basePrice ?? item.price ?? 0);
    const discountPrice = Number(item.discountPrice ?? basePrice);
    if (basePrice > discountPrice) {
      return sum + (basePrice - discountPrice) * quantity;
    }
    return sum;
  }, 0);

  const shippingFee = totalPrice >= 50000 ? 0 : totalPrice > 0 ? 3000 : 0;

  const finalPrice = totalPrice + shippingFee - useMileage;

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
        {discount > 0 && (
          <li className='flex justify-between'>
            <p className='text-gray-700 text-xl'>할인</p>
            <p className='font-semibold font-montserrat text-xl text-primary-200'>
              - {discount.toLocaleString()} won
            </p>
          </li>
        )}

        <li className='flex justify-between'>
          <p className='text-gray-700 text-xl'>마일리지 사용</p>
          <p className='font-semibold font-montserrat text-xl text-primary-200'>
            - {useMileage.toLocaleString()} won
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
