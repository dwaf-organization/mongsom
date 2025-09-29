// KaKaoLoginButton.jsx
import { useEffect, useState } from 'react';
import KakaoLogo from '../../../asset/logo/kakaoLogo.png';

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';

export default function KaKaoLoginButton() {
  const [ready, setReady] = useState(false);
  const redirectUri = `${window.location.origin}/auth/kakao/callback`;

  useEffect(() => {
    if (window.Kakao?.isInitialized?.()) {
      setReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src = KAKAO_SDK_URL;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
      setReady(true);
    };
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const handleLogin = () => {
    if (!ready) return;
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem('kakao_oauth_state', state);

    window.Kakao.Auth.authorize({
      redirectUri,
      state,
    });
  };

  return (
    <button onClick={handleLogin} disabled={!ready}>
      <img src={KakaoLogo} alt='' className='h-10 w-10 rounded-full' />
    </button>
  );
}
