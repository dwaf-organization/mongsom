import NaverLogo from '../../../asset/logo/naverLogo.png';

function buildNaverAuthUrl() {
  const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
  console.log('🚀 ~ buildNaverAuthUrl ~ clientId:', clientId);
  const redirectUri = `${window.location.origin}/auth/naver/callback`;
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
    >
      <img
        src={NaverLogo}
        alt='naver Logo'
        className='h-10 w-10 rounded-full'
      />
    </button>
  );
}
