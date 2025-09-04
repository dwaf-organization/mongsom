import { useState } from 'react';

import StarRating from '../StarRating';

export default function ReviewProductInfo() {
  const [rating, setRating] = useState(0);

  const handleRatingChange = newRating => {
    setRating(newRating);
  };

  return (
    <ul className='flex flex-col gap-4 pt-4 border-b border-gray-400 pb-4'>
      <li className='text-left font-semibold text-xl pt-6'>상품품질리뷰</li>
      <li className='text-left text-gray-500'>
        이 상품의 품질에 대해서 얼마나 만족하시나요 ?
      </li>
      <hr className='border-gray-400' />
      <li className='rounded-xl px-4 py-6 flex gap-4'>
        <img
          src={
            'https://contents.kyobobook.co.kr/sih/fit-in/400x0/gift/pdt/1106/hot1711961219730.jpg'
          }
          alt={'프리미엄 꿀 선물세트'}
          className='w-[200px] h-[200px] object-cover'
        />

        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 mb-1'>
            <p className='text-gray-900 font-semibold'>
              프리미엄 꿀 선물세트,2개
            </p>
          </div>

          <div className='flex  gap-2'>
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
            <p className='text-gray-500'>(필수)</p>
            <p className='text-red-500'>*</p>
          </div>
        </div>
      </li>
    </ul>
  );
}
