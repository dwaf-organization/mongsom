import { Link } from 'react-router-dom';

import NaverLogo from '../../../asset/logo/naverLogo.png';

export default function NaverSignUpButton() {
  return (
    <>
      <Link
        to='/kakao-signup'
        className='flex items-center  gap-20 border border-gray-400 rounded-md px-8'
      >
        <img
          src={NaverLogo}
          alt='NaverLogo'
          className='h-10 w-10 rounded-full'
        />
        <p className='font-semibold text-xl'>네이버로 회원가입</p>
      </Link>
    </>
  );
}
