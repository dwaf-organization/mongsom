import { Truck } from 'lucide-react';

export default function ProductHeader({ product }) {
  if (!product) return null;

  // 새로운 형식: basePrice가 직접 제공됨
  // 기존 형식: price + salesMargin
  // const salesMargin = product.salesMargin || 0;

  const discountPrice = product.discountPrice || 0;
  const discountPer = product.discountPer;
  const deliveryPrice = product.deliveryPrice || 3000;

  return (
    <ul className=''>
      <li className='flex items-center justify-start md:text-2xl font-bold text-gray-800 mb-4 max-w-md text-sm '>
        <p>{product.name || '상품명 없음'}</p>
      </li>
      {discountPer ? (
        <>
          <li>
            <p className='text-primary-600 text-end font-pretendard text-xl text-gray-600 line-through'>
              {Number(product.basePrice + product.salesMargin).toLocaleString()}{' '}
              원
            </p>
          </li>
          <li className='flex items-center justify-between border-b border-gray-500 pb-4'>
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

      <div className=' border-b border-gray-500 pb-4 mt-4'>
        <div className='flex justify-between items-center'>
          <p>배송비</p>
          <p>{Number(deliveryPrice).toLocaleString()}원</p>
        </div>

        <div className='text-xs text-gray-50 flex items-center gap-2 justify-end mt-1'>
          <p>
            <Truck size={18} />
          </p>
          <p>50,000원 이상 구매 시 무료배송</p>
        </div>
      </div>
    </ul>
  );
}
