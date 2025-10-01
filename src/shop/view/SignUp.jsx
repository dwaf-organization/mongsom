import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import SingUpFormSection from '../components/section/signUp/SingUpFormSection';

export default function SignUp() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-pretendard text-center'>
        회원가입
      </h2>
      {/* <SnsSignUpSection /> */}
      <SingUpFormSection />
    </InnerPaddingSectionWrapper>
  );
}
