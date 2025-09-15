import KakaoSignUpButton from '../../ui/SignUp/KakaoSignUpButton';
import NaverSignUpButton from '../../ui/SignUp/NaverSignUpButton';

export default function SnsSignUpSection() {
  return (
    <div className='grid grid-cols-2 gap-5 max-w-[900px] mx-auto py-8'>
      <KakaoSignUpButton />
      <NaverSignUpButton />
    </div>
  );
}
