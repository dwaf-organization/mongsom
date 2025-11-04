import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useToast } from '../context/ToastContext';
import { userLogin } from '../api/login';
import { useAuth } from '../context/AuthContext';
import SnsLogIn from '../components/section/login/SnsLogIn';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loginData, setLoginData] = useState({
    userId: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();

    const response = await userLogin(loginData);

    if (!response) {
      addToast('서버 응답이 없습니다.', 'error');
      return;
    }

    if (response.code === 1) {
      const userCode = response?.data?.userCode;
      if (userCode == null) {
        addToast('로그인 응답에 userCode가 없습니다.', 'error');
        return;
      }

      // 세션/컨텍스트 저장
      login({
        userData: { userId: loginData.userId },
        userCode,
      });

      addToast('로그인에 성공했습니다!', 'success');
      navigate('/');
    } else {
      addToast('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
  };

  return (
    <InnerPaddingSectionWrapper>
      <h3 className='text-lg md:text-4xl font-pretendard pb-4 md:pb-8 font-semibold text-center'>
        로그인
      </h3>
      <div className='flex flex-col items-center justify-center gap-4'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center justify-center gap-4 w-full max-w-[250px] md:max-w-[400px]'
        >
          <input
            type='text'
            placeholder='아이디'
            value={loginData.userId}
            onChange={e => handleInputChange('userId', e.target.value)}
            className='border border-gray-400 rounded-md p-2 md:p-3 w-full focus:outline-primary-200'
          />
          <input
            type='password'
            placeholder='비밀번호'
            value={loginData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            className='border border-gray-400 rounded-md p-2 md:p-3 focus:outline-primary-200 w-full'
          />
          <div className='flex justify-end w-full'>
            <Link to='/find-id' className='flex text-gray-500 text-xs'>
              아이디 찾기 /
            </Link>
            <Link to='/find-password' className='flex text-gray-500 text-xs'>
              비밀번호 찾기
            </Link>
          </div>
          <Button type='submit' className='w-full p-2 md:py-3'>
            로그인
          </Button>
        </form>
        <Link
          to='/signup'
          className='flex justify-center w-full max-w-[250px] md:max-w-[400px]'
        >
          <Button variant='outline' className='p-2 md:p-3'>
            회원가입
          </Button>
        </Link>

        <SnsLogIn />
      </div>
    </InnerPaddingSectionWrapper>
  );
}
