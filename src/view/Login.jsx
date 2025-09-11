import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import KakaoLogo from '../asset/logo/kakaoLogo.png';
import NaverLogo from '../asset/logo/naverLogo.png';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loginData, setLoginData] = useState({
    userId: '',
    password: '',
  });

  const TEMP_CREDENTIALS = {
    userId: 'mongsom',
    password: 'mongsom123!',
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = e => {
    e.preventDefault();

    if (
      loginData.userId === TEMP_CREDENTIALS.userId &&
      loginData.password === TEMP_CREDENTIALS.password
    ) {
      window.login(loginData.userId);
      addToast('로그인에 성공했습니다!', 'success');
      navigate('/');
    } else {
      addToast('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
  };

  return (
    <InnerPaddingSectionWrapper>
      <h3 className='text-4xl font-pretendard pb-8 font-semibold text-center'>
        로그인
      </h3>
      <div className='flex flex-col items-center justify-center gap-4'>
        <form
          onSubmit={handleLogin}
          className='flex flex-col items-center justify-center gap-4 w-full max-w-[400px]'
        >
          <input
            type='text'
            placeholder='아이디'
            value={loginData.userId}
            onChange={e => handleInputChange('userId', e.target.value)}
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <input
            type='password'
            placeholder='비밀번호'
            value={loginData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            className='border border-gray-400 rounded-md p-3 focus:outline-primary-200 w-full'
          />
          <div className='flex justify-end w-full'>
            <Link to='/find-id' className='flex text-gray-500 text-xs'>
              아이디 찾기 /
            </Link>
            <Link to='/find-password' className='flex text-gray-500 text-xs'>
              비밀번호 찾기
            </Link>
          </div>
          <Button type='submit' className='w-full py-3'>
            로그인
          </Button>
        </form>
        <Link to='/signup' className='flex justify-center w-full max-w-[400px]'>
          <Button variant='outline' className='p-3'>
            회원가입
          </Button>
        </Link>
        <div className='flex items-center w-full max-w-[400px] my-4'>
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
