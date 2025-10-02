export default function ProductHeader({ product }) {
  return (
    <ul className=''>
      <li className='flex items-center justify-start text-2xl font-bold text-gray-800 mb-4'>
        <p>{product.name}</p>
      </li>
      {product.discountPer ? (
        <>
          <li>
            <p className='text-primary-600 text-end font-pretendard text-xl text-gray-600 line-through'>
              {product.price.toLocaleString()}원
            </p>
          </li>
          <li className='flex items-center justify-between border-b-2 border-gray-500 pb-4'>
            <p className='text-primary-200 font-pretendard font-semibold text-2xl'>
              {product.discountPer}%
            </p>
            <p className='text-primary-600 text-end font-pretendard font-semibold text-2xl'>
              {product.discountPrice.toLocaleString()}원
            </p>
          </li>
        </>
      ) : (
        <>
          <li>
            <p className='text-primary-600 text-end font-pretendard text-2xl font-semibold'>
              {product.price.toLocaleString()}원
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
