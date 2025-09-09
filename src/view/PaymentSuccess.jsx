import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    if (orderId && paymentKey && amount) {
      setPaymentInfo({
        orderId,
        paymentKey,
        amount: parseInt(amount),
      });
    }

    sessionStorage.removeItem('purchaseItems');
  }, [searchParams]);

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='text-center'>
        <div className='text-6xl mb-6'></div>
        <h1 className='text-3xl font-bold text-primary-200 mb-4'>
          결제가 완료되었습니다!
        </h1>
        <p className='text-gray-600 mb-8'>주문이 성공적으로 처리되었습니다.</p>

        {paymentInfo && (
          <div className='rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-semibold text-left mb-6'>결제 정보</h2>
            <div className='space-y-2 text-left'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>주문번호:</span>
                <span className='font-mono'>{paymentInfo.orderId}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>결제키:</span>
                <span className='font-mono text-sm'>
                  {paymentInfo.paymentKey}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>결제금액:</span>
                <span className='font-semibold'>
                  {paymentInfo.amount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        <div className='flex gap-4 mb-20'>
          <button
            onClick={() => (window.location.href = '/')}
            className='w-full bg-primary-200 text-white py-3 px-6 rounded-lg transition-colors'
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => (window.location.href = '/mypage')}
            className='w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors'
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}
