export default function TotalPrice({ totalPrice, shippingFee = 3000 }) {
  // 5만원 미만일 때만 배송비 추가
  const actualShippingFee = totalPrice < 50000 ? shippingFee : 0;
  const finalTotal = totalPrice + actualShippingFee;

  return (
    <div className='flex flex-col gap-3  rounded-lg '>
      <div className='flex justify-between items-center'>
        <span className='text-gray-600'>총 금액</span>
        <span className='text-gray-900 font-semibold'>
          {totalPrice.toLocaleString()}원
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='text-gray-600'>배송비</span>
        <span className='text-gray-900 font-semibold'>
          {actualShippingFee.toLocaleString()}원
        </span>
      </div>

      <div className='border-t border-gray-300 pt-3'>
        <div className='flex justify-between items-center'>
          <span className='text-lg font-semibold text-gray-800'>
            총 결제금액
          </span>
          <span className='text-xl font-bold text-primary-600'>
            {finalTotal.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
