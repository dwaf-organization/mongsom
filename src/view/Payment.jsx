import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { TOSS_PAYMENTS_CONFIG } from '../constants/tossPayments';

export default function Payment() {
  const [tossPayments, setTossPayments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 토스페이먼츠 SDK 초기화
  useEffect(() => {
    const initializeTossPayments = async () => {
      try {
        setIsLoading(true);
        const tossPaymentsInstance = await loadTossPayments(
          TOSS_PAYMENTS_CONFIG.CLIENT_KEY,
        );
        setTossPayments(tossPaymentsInstance);
        setError(null);
      } catch (err) {
        console.error('토스페이먼츠 초기화 실패:', err);
        setError('결제 시스템을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTossPayments();
  }, []);

  // 결제 위젯 렌더링
  useEffect(() => {
    if (!tossPayments) return;

    const renderPaymentWidget = async () => {
      try {
        // 결제 위젯 렌더링
        await tossPayments.renderPaymentMethods({
          selector: '#payment-method',
          amount: {
            currency: 'KRW',
            value: 10000, // 테스트용 10,000원
          },
        });

        // 결제 수단 선택 위젯 렌더링
        await tossPayments.renderAgreement({
          selector: '#agreement',
        });
      } catch (err) {
        console.error('결제 위젯 렌더링 실패:', err);
        setError('결제 위젯을 불러오는데 실패했습니다.');
      }
    };

    renderPaymentWidget();
  }, [tossPayments]);

  // 결제 요청 함수
  const handlePayment = async () => {
    if (!tossPayments) {
      alert('결제 시스템이 아직 로드되지 않았습니다.');
      return;
    }

    try {
      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: 10000,
        orderId: `ORDER_${Date.now()}`,
        orderName: '몽쏨 테스트 상품',
        customerName: '홍길동',
        customerEmail: 'test@example.com',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 요청 실패:', err);
      alert('결제 요청에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>결제 시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='text-red-500 text-xl mb-4'>⚠️</div>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-8'>결제하기</h1>

      <div className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
        {/* 주문 정보 */}
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>주문 정보</h2>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>상품명:</span>
              <span>몽쏨 테스트 상품</span>
            </div>
            <div className='flex justify-between'>
              <span>수량:</span>
              <span>1개</span>
            </div>
            <div className='flex justify-between text-lg font-semibold'>
              <span>총 결제금액:</span>
              <span>10,000원</span>
            </div>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>결제 수단</h2>
          <div
            id='payment-method'
            className='border border-gray-200 rounded-lg p-4'
          ></div>
        </div>

        {/* 약관 동의 */}
        <div className='mb-6'>
          <h2 className='text-xl font-semibold mb-4'>약관 동의</h2>
          <div
            id='agreement'
            className='border border-gray-200 rounded-lg p-4'
          ></div>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          className='w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors'
        >
          결제하기
        </button>
      </div>

      {/* 테스트 안내 */}
      <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <h3 className='font-semibold text-yellow-800 mb-2'>🧪 테스트 모드</h3>
        <p className='text-sm text-yellow-700'>
          현재 테스트 모드로 실행 중입니다. 실제 결제가 발생하지 않습니다.
        </p>
        <div className='mt-2 text-xs text-yellow-600'>
          <p>• 테스트 카드번호: 4242424242424242</p>
          <p>• 유효기간: 12/34, CVC: 123</p>
        </div>
      </div>
    </div>
  );
}
