export default function ProductHeader({ product }) {
  if (!product) return null;

  // 필수 필드들이 모두 있는지 확인
  const price = product.price || 0;
  const salesMargin = product.salesMargin || 0;
  const discountPrice = product.discountPrice || 0;
  const discountPer = product.discountPer;

  const basePrice = price + salesMargin;

  return (
    <ul className=''>
      <li className='flex items-center justify-start md:text-2xl font-bold text-gray-800 mb-4 max-w-md text-sm '>
        <p>{product.name || '상품명 없음'}</p>
      </li>
      {discountPer ? (
        <>
          <li>
            <p className='text-primary-600 text-end font-pretendard text-xl text-gray-600 line-through'>
              {Number(basePrice).toLocaleString()} 원
            </p>
          </li>
          <li className='flex items-center justify-between border-b-2 border-gray-500 pb-4'>
            <p className='text-primary-200 font-pretendard font-semibold text-2xl'>
              {discountPer}%
            </p>
            <p className='text-primary-600 text-end font-pretendard font-semibold text-2xl'>
              {Number(discountPrice).toLocaleString()}원
            </p>
          </li>
        </>
      ) : (
        <>
          <li>
            <p className='text-primary-600 text-end font-pretendard text-2xl font-semibold'>
              {Number(discountPrice).toLocaleString()}원
            </p>
          </li>
        </>
      )}

      <li className='flex items-center justify-between border-b-2 text-lg text-gray-500 border-gray-500 pb-4 mt-4'>
        <p>배송비</p>
        <p>3,000원</p>
      </li>
    </ul>
  );
}
