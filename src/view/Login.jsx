import { Link } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import KakaoLogo from '../asset/logo/kakaoLogo.png';
import NaverLogo from '../asset/logo/naverLogo.png';

export default function Login() {
  return (
    <InnerPaddingSectionWrapper>
      <h3 className='text-4xl font-pretendard py-20'>로그인</h3>
      <div className='flex flex-col items-center justify-center gap-4'>
        <input
          type='text'
          placeholder='아이디'
          className='border border-gray-400 rounded-md p-3 w-full max-w-[600px] focus:outline-primary-200'
        />
        <input
          type='password'
          placeholder='비밀번호'
          className='border border-gray-400 rounded-md p-3 focus:outline-primary-200 w-full max-w-[600px]'
        />
        <Link
          to='/'
          className='flex justify-end w-full max-w-[600px] text-gray-500 text-sm'
        >
          비밀번호 찾기
        </Link>
        <Button className='w-full max-w-[600px] py-3'>로그인</Button>
        <Link to='/signup' className='flex justify-center w-full max-w-[600px]'>
          <Button variant='outline' className='p-3'>
            회원가입
          </Button>
        </Link>
        <div className='flex items-center w-full max-w-[600px] my-4'>
          <hr className='flex-grow border-t border-gray-300' />
          <span className='mx-4 text-gray-500 whitespace-nowrap'>
            SNS로 로그인
          </span>
          <hr className='flex-grow border-t border-gray-300' />
        </div>
        <div className='flex gap-6'>
          <Link>
            <img
              src={KakaoLogo}
              alt='Mongsom Logo'
              className='h-10 w-10 rounded-full'
            />
          </Link>
          <Link>
            <img
              src={NaverLogo}
              alt='naver Logo'
              className='h-10 w-10 rounded-full'
            />
          </Link>
        </div>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
