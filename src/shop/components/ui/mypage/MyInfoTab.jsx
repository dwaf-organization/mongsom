import MyInfoForm from './MyInfoForm';

export default function MyInfoTab() {
  return (
    <div>
      <MyInfoForm />
      <button className='w-full text-gray-500 text-right hover:text-red-500 hover:underline'>
        회원 탈퇴
      </button>
    </div>
  );
}
