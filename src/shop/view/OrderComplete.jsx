import React from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function OrderComplete() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const finalPrice = searchParams.get('finalPrice');

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <div className='flex flex-col items-center py-10'>
        {/* Success Icon */}
        <div className='mb-6 animate-bounce'>
          <CheckCircle2
            className='w-20 h-20 text-green-500'
            strokeWidth={1.5}
          />
        </div>

        {/* Title */}
        <h2 className='text-3xl font-bold font-pretendard mb-3 text-gray-800'>
          주문이 완료되었습니다
        </h2>
        <p className='text-gray-500 mb-8 text-center'>
          소중한 주문 감사드립니다
        </p>

        {/* Payment Information Card */}
        <div className='w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md border border-blue-100 p-8 mb-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
            <span className='w-1.5 h-6 bg-blue-500 rounded-full'></span>
            무통장 입금 안내
          </h3>

          <div className='space-y-4'>
            {/* Account Info */}
            <div className='bg-white rounded-xl p-5 shadow-sm'>
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-500 mb-1'>입금 계좌</p>
                  <p className='text-lg font-semibold text-gray-800'>
                    부산은행 113-2019-7400-06
                  </p>
                  <p className='text-sm text-gray-600 mt-1'>
                    (예금주: 주식회사 몽솜)
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className='bg-white rounded-xl p-5 shadow-sm'>
              <div className='flex items-start gap-3'>
                <div className='flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-amber-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div className='flex-1'>
                  <p className='text-sm text-gray-500 mb-1'>입금 금액</p>
                  <p className='text-lg font-semibold text-gray-800'>
                    {Number(finalPrice).toLocaleString()} 원
                  </p>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4'>
              <div className='flex items-start gap-2'>
                <svg
                  className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-amber-800 leading-relaxed'>
                  입금 확인 후 상품이 발송됩니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 w-full mt-4'>
          <button
            onClick={() => (window.location.href = '/mypage?tab=orderList')}
            className='flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200'
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => (window.location.href = '/shop')}
            className='flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200'
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
