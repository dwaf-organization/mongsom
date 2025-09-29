// src/pages/PaymentSuccess.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { paymentConfirm } from '../api/payment';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // 쿼리 파라미터는 메모이제이션해서 의존성 깔끔하게
  const orderId = useMemo(
    () => searchParams.get('orderId') || '',
    [searchParams],
  );
  const paymentKey = useMemo(
    () => searchParams.get('paymentKey') || '',
    [searchParams],
  );
  const amount = useMemo(() => {
    const raw = searchParams.get('amount');
    return raw ? parseInt(raw, 10) : NaN;
  }, [searchParams]);

  // 더블 호출 방지 (StrictMode나 재렌더에서 두번 날리는 거 방어)
  const calledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      // 필수 파라미터 검증
      if (!orderId || !paymentKey || !Number.isFinite(amount)) {
        setErr('필수 결제 파라미터가 없습니다. (orderId/paymentKey/amount)');
        return;
      }
      if (calledRef.current) return;
      calledRef.current = true;

      setLoading(true);
      setErr(null);

      const payload = { orderId, paymentKey, amount };

      // try {
      //   // 화면 표시용 state는 따로 세팅
      //   setPaymentInfo(payload);

      //   // 실제 결제 승인 확인 호출
      //   const res = await paymentConfirm(payload);
      //   // 네 API 응답 형식에 맞춰 처리
      //   // 예: if (res.code !== 1) throw new Error(res.message || '승인 실패');
      //   // 콘솔 확인
      //   console.log('🚀 paymentConfirm res:', res);

      //   // 장바구니 등 세션 데이터 정리
      //   sessionStorage.removeItem('purchaseItems');
      // } catch (e) {
      //   console.error(e);
      //   setErr(e?.message || '결제 확인 중 오류가 발생했습니다.');
      // } finally {
      //   setLoading(false);
      // }
    };

    run();
  }, [orderId, paymentKey, amount]);

  return (
    <div className='mx-auto max-w-2xl p-6'>
      <div className='text-center'>
        <div className='mb-6 text-6xl' />

        {err ? (
          <>
            <h1 className='mb-4 text-3xl font-bold text-red-600'>
              결제 처리 실패
            </h1>
            <p className='mb-8 text-gray-600'>{err}</p>
          </>
        ) : (
          <>
            <h1 className='mb-4 text-3xl font-bold text-primary-200'>
              {loading ? '결제 확인 중...' : '결제가 완료되었습니다!'}
            </h1>
            <p className='mb-8 text-gray-600'>
              {loading
                ? '잠시만 기다려 주세요.'
                : '주문이 성공적으로 처리되었습니다.'}
            </p>
          </>
        )}

        {paymentInfo && !err && (
          <div className='mb-8 rounded-lg p-6'>
            <h2 className='mb-6 text-left text-xl font-semibold'>결제 정보</h2>
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
                  {Number(paymentInfo.amount).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        <div className='mb-20 flex gap-4'>
          <button
            onClick={() => (window.location.href = '/')}
            className='w-full rounded-lg bg-primary-200 px-6 py-3 text-white transition-colors'
            disabled={loading}
          >
            홈으로 돌아가기
          </button>
          <button
            onClick={() => (window.location.href = '/mypage')}
            className='w-full rounded-lg bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700'
            disabled={loading}
          >
            주문 내역 보기
          </button>
        </div>
      </div>
    </div>
  );
}
