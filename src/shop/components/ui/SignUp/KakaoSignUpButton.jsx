import { Link } from 'react-router-dom';

import KakaoLogo from '../../../asset/logo/kakaoLogo.png';

export default function KakaoSignUpButton() {
  return (
    <>
      <Link
        to='/kakao-signup'
        className='flex items-center gap-20 border border-gray-400 rounded-md px-8 py-5'
      >
        <img
          src={KakaoLogo}
          alt='KakaoLogo'
          className='h-10 w-10 rounded-full'
        />
        <p className='font-semibold text-xl'>카카오로 회원가입</p>
      </Link>
    </>
  );
}
