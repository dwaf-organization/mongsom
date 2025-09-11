import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FindPassword() {
  const navigate = useNavigate();

  const handleFindPassword = () => {
    navigate('/password-reset-complete');
  };
  return (
    <InnerPaddingSectionWrapper className='max-w-[500px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-400 max-w-[500px] w-full pb-4'>
        비밀번호 찾기
      </h2>
      <div className='flex flex-col items-center justify-center gap-4 pt-10'>
        <form className='flex flex-col items-center justify-center gap-4 w-full max-w-[400px]'>
          <input
            type='text'
            placeholder='이름'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <input
            type='text'
            placeholder='아이디'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <input
            type='text'
            placeholder='이메일'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <Button
            type='submit'
            className='w-full py-3'
            onClick={handleFindPassword}
          >
            비밀번호 찾기
          </Button>
        </form>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
