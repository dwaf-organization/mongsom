import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = e => {
    e.preventDefault();
    navigate('/admin/orders');
  };
  return (
    <InnerPaddingSectionWrapper className='max-w-[400px] pt-40'>
      <div className='flex flex-col items-center justify-center w-full gap-4'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>로그인</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <input
            type='text'
            placeholder='아이디'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
          />
          <input
            type='password'
            placeholder='비밀번호'
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
