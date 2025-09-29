import NaverLogo from '../../../asset/logo/naverLogo.png';

export default function NaverLoginButton() {
  return (
    <>
      <button>
        <img
          src={NaverLogo}
          alt='naver Logo'
          className='h-10 w-10 rounded-full'
        />
      </button>
    </>
  );
}
