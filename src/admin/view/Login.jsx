import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userLogin } from '../api/login';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
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
    if (response.code === 1) {
      console.log('🚀 ~ handleSubmit ~ response:', response);
      login({
        userData: { userId: loginData.userId },
        userCode: response.data,
      });
      addToast('로그인에 성공했습니다!', 'success');
      navigate('/admin/orders');
    }
    if (response.code === -1) {
      addToast('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
    // navigate('/admin/orders');
  };
  return (
    <InnerPaddingSectionWrapper className='max-w-[400px] pt-40'>
      <div className='flex flex-col items-center justify-center w-full gap-4'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>로그인</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <input
            type='text'
            placeholder='아이디'
            onChange={e => handleInputChange('userId', e.target.value)}
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <input
            type='password'
            placeholder='비밀번호'
            onChange={e => handleInputChange('password', e.target.value)}
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <Button type='submit' className='w-full py-3'>
            로그인
          </Button>
        </form>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
