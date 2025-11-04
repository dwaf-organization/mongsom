import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentConfirm } from '../api/payment';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const { userCode } = useAuth();

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

  const calledRef = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (!orderId || !paymentKey || !Number.isFinite(amount)) {
        setErr('필수 결제 파라미터가 없습니다. (orderId/paymentKey/amount)');
        return;
      }
      if (calledRef.current) return;
      calledRef.current = true;

      setLoading(true);
      setErr(null);

      const payload = { orderId, paymentKey, amount, userCode };

      try {
        setPaymentInfo(payload);

        const res = await paymentConfirm(payload);
        console.log('🚀 ~ run ~ res:', res);
        if (res.code == -1) {
          // navigate('/payment/fail');
          return setErr(res.data);
        }

        sessionStorage.removeItem('purchaseItems');
      } catch (e) {
        console.error(e);
        setErr(e?.message || '결제 확인 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
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
