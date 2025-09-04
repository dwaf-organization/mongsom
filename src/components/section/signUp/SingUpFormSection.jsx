import SignUpFormHeader from '../../ui/SignUp/SignUpFormHeader';
import SignUpForm from '../../ui/SignUp/SignUpForm';

export default function SingUpFormSection() {
  return (
    <div className='flex flex-col justify-center py-6 space-y-6 max-w-[900px] mx-auto'>
      <SignUpFormHeader />
      <SignUpForm />
    </div>
  );
}
