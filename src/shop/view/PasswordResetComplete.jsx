import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Link } from 'react-router-dom';

export default function PasswordResetComplete() {
  return (
    <InnerPaddingSectionWrapper className='max-w-[500px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard '>
        임시비밀번호가 이메일로 발송되었습니다
      </h2>
      <div className='flex flex-col items-start justify-center gap-4 py-10'>
        <p>임시비밀번호로 로그인 후 비밀번호를 변경해주세요</p>
        <p className='text-gray-500 text-sm'>
          * 로그인 &gt; 마이페이지 &gt; 내 정보 에서 비밀번호 변경이 가능합니다.
        </p>
      </div>
      <Link
        to='/login'
        className='bg-primary-200 text-white px-8 py-4  rounded-md'
      >
        로그인 하러가기
      </Link>
    </InnerPaddingSectionWrapper>
  );
}
