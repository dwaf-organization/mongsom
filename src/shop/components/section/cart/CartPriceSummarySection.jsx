export default function CartPriceSummarySection({ cart = [] }) {
  const isChecked = v => v === 1 || v === '1' || v === true;

  const selectedItems = cart.filter(item => isChecked(item.checkStatus));

  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + Number(item.discountPrice || 0) * Number(item.quantity || 0),
    0,
  );

  const shippingFee = totalPrice > 0 ? 3000 : 0;
  const finalPrice = totalPrice + shippingFee;

  return (
    <ul className='pt-4 flex flex-col gap-4 font-semibold'>
      <li className='flex justify-between '>
        <p className='text-gray-700'>총 주문 금액</p>
        <p>{totalPrice.toLocaleString()}원</p>
      </li>
      <li className='flex justify-between border-b border-gray-500 pb-4'>
        <p className='text-gray-700'>배송비</p>
        <p>{shippingFee.toLocaleString()}원</p>
      </li>
      <li className='flex justify-between border-b border-gray-700 pb-4 text-2xl'>
        <p>총 결제 금액</p>
        <p>{finalPrice.toLocaleString()}원</p>
      </li>
    </ul>
  );
}
