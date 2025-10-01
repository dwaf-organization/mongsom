import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { findId } from '../api/login';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function FindId() {
  const { addToast } = useToast();
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const [findIdData, setFindIdData] = useState({
    name: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setFindIdData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (findIdData.name === '' || findIdData.email === '') {
      addToast('이름과 이메일을 입력해주세요.', 'error');
      return;
    }
    const response = await findId(findIdData);
    setResponse(response);
    console.log(findIdData);

    if (response?.code === -1) {
      addToast('아이디 찾기에 실패했습니다.', 'error');
    }
  };

  if (response && response.code === 1) {
    return (
      <InnerPaddingSectionWrapper>
        <div className='flex flex-col items-center justify-center gap-4 pt-10'>
          <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-400 max-w-[500px] w-full pb-4'>
            아이디 찾기
          </h2>
          <div className='flex flex-col items-center justify-center gap-4 pt-10'>
            <div className='flex items-center justify-center gap-4'>
              <p className='text-center py-5'>회원님의 아이디는 </p>
              <p className='font-bold'>{response.data.userId}</p>
              <p className='text-center py-5'>입니다.</p>
            </div>
            <Button onClick={() => navigate('/login')} className='w-full py-3'>
              로그인
            </Button>
          </div>
        </div>
      </InnerPaddingSectionWrapper>
    );
  }

  return (
    <InnerPaddingSectionWrapper className='max-w-[500px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-400 max-w-[500px] w-full pb-4'>
        아이디 찾기
      </h2>
      <div className='flex flex-col items-center justify-center gap-4 pt-10'>
        <form
          className='flex flex-col items-center justify-center gap-4 w-full max-w-[400px]'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            placeholder='이름'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={findIdData.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          <input
            type='text'
            placeholder='이메일'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={findIdData.email}
            onChange={e => handleInputChange('email', e.target.value)}
          />

          <Button type='submit' className='w-full py-3'>
            아이디 찾기
          </Button>
        </form>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
