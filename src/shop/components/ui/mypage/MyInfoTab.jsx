import MyInfoForm from './MyInfoForm';
import { useAuth } from '../../../context/AuthContext';
import { getUserInfo } from '../../../api/myPage';
import { useEffect, useState } from 'react';
import { useModal } from '../../../context/ModalContext';
import DeleteUserModal from './DeleteUserModal';

export default function MyInfoTab() {
  const { userCode } = useAuth();
  console.log('🚀 ~ MyInfoTab ~ userCode:', userCode);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openModal } = useModal();

  useEffect(() => {
    let cancelled = false;

    async function fetchUserInfo() {
      if (!userCode) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserInfo(userCode);
        console.log('🚀 ~ fetchUserInfo ~ data:', data);
        if (!cancelled) setUserData(data || null);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        if (!cancelled) setUserData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUserInfo();
    return () => {
      cancelled = true;
    };
  }, [userCode]);

  if (loading)
    return (
      <div className='py-8 text-center text-gray-500'>
        내 정보 불러오는 중...
      </div>
    );

  const handleDelete = () => {
    openModal(<DeleteUserModal />);
  };

  return (
    <div>
      {userData ? (
        <MyInfoForm userData={userData} />
      ) : (
        <div className='text-center text-gray-500'>정보가 없습니다.</div>
      )}
      <button
        className='w-full text-gray-500 text-right hover:text-red-500 hover:underline'
        onClick={handleDelete}
      >
        회원 탈퇴
      </button>
    </div>
  );
}
