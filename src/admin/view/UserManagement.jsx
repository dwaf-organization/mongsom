import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useEffect, useState } from 'react';
import UserTableSection from '../components/section/userManagement/UserTableSection';
import Pagination from '../components/ui/Pagination';
import { getUserList } from '../api/user';
import { useSearchParams } from 'react-router-dom';

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [userList, setUserList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  useEffect(() => {
    const fetchUserList = async () => {
      const size = 10;
      const userList = await getUserList({ page, size });
      console.log('🚀 ~ fetchUserList ~ userList:', userList);
      if (userList.code === 1) {
        setUserList(userList.data.users);
        setPagination(userList.data.pagination.totalPage);
      }
    };
    fetchUserList();
  }, [page]);
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>회원관리</h2>
      <UserTableSection userList={userList} />
      <Pagination totalPage={pagination} />
    </InnerPaddingSectionWrapper>
  );
}
