import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useEffect, useState, useCallback } from 'react';
import UserTableSection from '../components/section/userManagement/UserTableSection';
import Pagination from '../components/ui/Pagination';
import { getUserList } from '../api/user';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/ui/SearchForm';

export default function UserManagement() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 0);
  const [userList, setUserList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [searchParamsItem, setSearchParamsItem] = useState({});

  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearchParamsItem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchUserList = useCallback(
    async (searchItem = '') => {
      const size = 10;
      const userList = await getUserList({
        page,
        size,
        searchItem,
      });
      console.log('🚀 ~ fetchUserList ~ userList:', userList);
      if (userList.code === 1) {
        setUserList(userList.data.users);
        setPagination(userList.data.pagination.totalPage);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>회원관리</h2>

      <section>
        {' '}
        <SearchForm submitButtonText='조회' onSubmit={() => fetchUserList(searchParamsItem.name || '')}>
          <div className='grid grid-cols-[120px_1fr]'>
            <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
              회원정보
            </div>

            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                placeholder='전화번호 또는 이름을 입력하세요'
                name='name'
                className='w-full border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                value={searchParamsItem.name || ''}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </SearchForm>
      </section>
      <UserTableSection userList={userList} onRefresh={fetchUserList} />
      <Pagination totalPage={pagination} />
    </InnerPaddingSectionWrapper>
  );
}
