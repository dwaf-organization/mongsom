import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    if (code || message || orderId) {
      setErrorInfo({
        code,
        message,
        orderId,
      });
    }
  }, [searchParams]);

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='text-center'>
        <div className='text-6xl mb-6'>❌</div>
        <h1 className='text-3xl font-bold text-red-600 mb-4'>
          결제에 실패했습니다
        </h1>
        <p className='text-gray-600 mb-8'>결제 처리 중 오류가 발생했습니다.</p>

        {errorInfo && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-red-800'>
              오류 정보
            </h2>
            <div className='space-y-2 text-left'>
              {errorInfo.code && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>오류 코드:</span>
                  <span className='font-mono text-red-600'>
                    {errorInfo.code}
                  </span>
                </div>
              )}
              {errorInfo.message && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>오류 메시지:</span>
                  <span className='text-red-600'>{errorInfo.message}</span>
                </div>
              )}
              {errorInfo.orderId && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>주문번호:</span>
                  <span className='font-mono'>{errorInfo.orderId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='space-y-4'>
          <button
            onClick={() => window.history.back()}
            className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors'
          >
            다시 시도하기
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className='w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors'
          >
            홈으로 돌아가기
          </button>
        </div>

        <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <h3 className='font-semibold text-yellow-800 mb-2'>
            💡 도움이 필요하신가요?
          </h3>
          <p className='text-sm text-yellow-700'>
            결제 관련 문의사항이 있으시면 고객센터로 연락해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
