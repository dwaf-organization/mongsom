import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import UserTableSection from '../components/section/userManagement/UserTableSection';

export default function UserManagement() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>회원관리</h2>
      <UserTableSection />
    </InnerPaddingSectionWrapper>
  );
}
