export default function CartPriceSummarySection() {
  return (
    <ul className='pt-4 flex flex-col gap-4 font-semibold'>
      <li className='flex justify-between '>
        <p className='text-gray-700'>총 주문 금액</p>
        <p>100,000원</p>
      </li>
      <li className='flex justify-between border-b border-gray-500 pb-4'>
        <p className='text-gray-700'>배송비</p>
        <p>3,000원</p>
      </li>
      <li className='flex justify-between border-b border-gray-700 pb-4  text-2xl'>
        <p>총 결제 금액</p>
        <p>103,000원</p>
      </li>
    </ul>
  );
}
