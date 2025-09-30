import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function NaverCallback() {
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState('처리 중...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const stored = sessionStorage.getItem('NAVER_OAUTH_STATE');

    if (!code || !state) return setMsg('code/state 누락');
    if (stored !== state) return setMsg('state 불일치');

    setMsg('성공: code/state 수신 완료. 이제 토큰 교환은 백엔드에서 하세요.');
  }, [searchParams]);

  return (
    <div className='mx-auto mt-20 max-w-md rounded-lg border p-6 text-center'>
      <p className='text-sm text-gray-700'>{msg}</p>
      <div className='mt-4 text-left text-xs'>
        <div>
          code: <code>{searchParams.get('code') || '-'}</code>
        </div>
        <div>
          state: <code>{searchParams.get('state') || '-'}</code>
        </div>
      </div>
    </div>
  );
}
