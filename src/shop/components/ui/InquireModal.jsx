import { useState } from 'react';
import { PRICE_OPTIONS, CATEGORY_OPTIONS } from '../../constants/inquiry';
import { Button } from './button';

export default function InquireModal() {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 px-10'>
      <h2 className='py-4 text-center font-montserrat text-4xl font-bold'>
        CONTACT
      </h2>

      <form>
        <section className='w-full'>
          <label className='w-full text-lg font-bold'>카테고리</label>
          <div
            className='pt-4 flex w-full flex-wrap items-center gap-3'
            role='radiogroup'
            aria-label='카테고리'
          >
            {CATEGORY_OPTIONS.map(({ id, label, Icon }) => {
              const selected = selectedCategory === id;
              return (
                <button
                  key={id}
                  type='button'
                  role='radio'
                  aria-checked={selected}
                  onClick={() => setSelectedCategory(id)}
                  className={[
                    'flex h-[156px] w-[156px] flex-col items-center justify-center gap-2 rounded-md border-2 transition',
                    selected
                      ? 'border-primary-200 ring-2 ring-primary-200/20'
                      : 'border-gray-300 hover:border-gray-400',
                  ].join(' ')}
                >
                  <Icon />
                  <p className='text-sm'>{label}</p>
                </button>
              );
            })}
          </div>
          <input
            type='hidden'
            name='categoryId'
            value={selectedCategory || ''}
          />
        </section>

        <section className='py-4 flex w-full max-w-[800px] flex-col gap-2'>
          <label className='w-full'>
            이름
            <input
              type='text'
              placeholder='이름,회사명'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>
          <label className='w-full'>
            이메일
            <input
              type='email'
              placeholder='이메일'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>
          <label className='w-full'>
            전화번호
            <input
              type='tel'
              placeholder='전화번호'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>
          <label className='w-full'>
            문의내용
            <input
              type='text'
              placeholder='문의내용'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>
        </section>

        {/* 희망 가격 */}
        <section className='flex flex-col pb-5'>
          <h2 className='mb-2 font-semibold'>희망 가격</h2>
          <div
            className='flex flex-wrap gap-2'
            role='radiogroup'
            aria-label='희망 가격'
          >
            {PRICE_OPTIONS.map(opt => {
              const selected = selectedPrice === opt.id;
              return (
                <button
                  key={opt.id}
                  type='button'
                  role='radio'
                  aria-checked={selected}
                  onClick={() => setSelectedPrice(opt.id)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm transition',
                    selected
                      ? 'border-primary-200 bg-primary-200 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <input
            type='hidden'
            name='priceOptionId'
            value={selectedPrice || ''}
          />
        </section>
      </form>

      <Button className='text-md py-3 rounded-sm mb-4'>
        견적 문의신청하기
      </Button>
    </div>
  );
}
