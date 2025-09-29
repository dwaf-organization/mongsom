// src/components/auth/NaverLoginButton.jsx
import NaverLogo from '../../../asset/logo/naverLogo.png';

function buildNaverAuthUrl() {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
  console.log('🚀 ~ buildNaverAuthUrl ~ clientId:', clientId);
  const redirectUri = encodeURIComponent(
    process.env.REACT_APP_NAVER_REDIRECT_URI,
  );
  console.log('🚀 ~ buildNaverAuthUrl ~ redirectUri:', redirectUri);
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem('NAVER_OAUTH_STATE', state);

  const base = 'https://nid.naver.com/oauth2.0/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });
  return `${base}?${params.toString()}`;
}

export default function NaverLoginButton() {
  return (
    <button
      type='button'
      onClick={() => (window.location.href = buildNaverAuthUrl())}
      className='inline-flex items-center gap-2 rounded-lg border border-[#03C75A]/20 bg-[#03C75A] px-4 py-2 text-white'
    >
      <img src={NaverLogo} alt='Naver' className='h-6 w-6 rounded' />
      <span className='text-sm font-semibold'>네이버로 로그인</span>
    </button>
  );
}
