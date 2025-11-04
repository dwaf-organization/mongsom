import KaKaoLoginButton from '../../ui/logIn.jsx/KaKaoLoginButton';
import NaverLoginButton from '../../ui/logIn.jsx/NaverLoginButton';

export default function SnsLogIn() {
  return (
    <>
      <div className='flex items-center w-full max-w-[250px] md:max-w-[400px] my-4'>
        <hr className='flex-grow border-t border-gray-300' />
        <span className='mx-4 text-sm md:text-base text-gray-500 whitespace-nowrap'>
          SNS로 로그인
        </span>
        <hr className='flex-grow border-t border-gray-300' />
      </div>
      <div className='flex gap-2 md:gap-6'>
        <KaKaoLoginButton />
        <NaverLoginButton />
      </div>
    </>
  );
}
