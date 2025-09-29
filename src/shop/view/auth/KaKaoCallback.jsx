// KaKaoCallback.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function formEncode(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
    .join('&');
}

export default function KaKaoCallback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState('코드 교환 중…');

  useEffect(() => {
    const run = async () => {
      const code = sp.get('code');
      const state = sp.get('state');
      const storedState = sessionStorage.getItem('kakao_oauth_state');

      if (!code) {
        setMsg('code 없음');
        return;
      }
      if (!storedState || storedState !== state) {
        setMsg('state 불일치 (새로고침/다른 탭 문제 가능)');
      }

      try {
        // ⚠️ 여기에 "REST API 키"를 프론트에 노출합니다(보안상 취약)
        const clientId = process.env.REACT_APP_REST_API_KEY;
        const redirectUri = `${window.location.origin}/auth/kakao/callback`;

        const body = formEncode({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
        });

        const resp = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body,
        });

        if (!resp.ok) {
          const errText = await resp.text();
          console.error('토큰 응답 실패:', resp.status, errText);
          setMsg(`토큰 교환 실패 (HTTP ${resp.status}) - 대부분 CORS로 차단됨`);
          return;
        }

        const token = await resp.json();
        console.log('카카오 토큰:', token);
        setMsg('토큰 획득 성공! 사용자 정보 가져오는 중…');

        const me = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });
        console.log('🚀 ~ run ~ me:', me);

        if (!me.ok) {
          const t = await me.text();
          console.error('me 실패:', me.status, t);
          setMsg(`사용자 정보 조회 실패 (HTTP ${me.status})`);
          return;
        }

        const profile = await me.json();
        console.log('카카오 프로필:', profile);

        setMsg('로그인 성공! 메인으로 이동합니다.');
        navigate('/', { replace: true });
      } catch (err) {
        console.error(err);
        setMsg('네트워크/CORS 에러로 실패');
      } finally {
        // 일회성 state 제거
        sessionStorage.removeItem('kakao_oauth_state');
      }
    };

    run();
  }, [sp, navigate]);

  return (
    <div className='p-6 text-sm'>
      <p>{msg}</p>
      <p className='mt-2 text-gray-500'>
        * CORS로 막히면 서버 프록시(백엔드)로 코드→토큰 교환을 구현해야 합니다.
      </p>
    </div>
  );
}
