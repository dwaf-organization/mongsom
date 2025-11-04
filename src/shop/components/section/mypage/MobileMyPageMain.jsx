// MobileMyPageNav.jsx
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// 아이콘
import MyInfo from '../../../asset/icons/MyInfo';
import Order from '../../../asset/icons/Order';
import Review from '../../../asset/icons/Review';

export default function MobileMyPageNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || ''; // 초기 비활성
  const { isAuthenticated, logout } = useAuth();

  // ✅ 네가 요구한 ID들로 구성
  const items = [
    { id: 'myInfo', label: '내 정보', Icon: MyInfo },
    { id: 'orderList', label: '주문 내역', Icon: Order },
    { id: 'myReview', label: '리뷰 관리', Icon: Review },
  ];

  const handleSelect = id => {
    // 기존 쿼리 유지하면서 tab만 교체
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', id);
      return next;
    });
  };

  return (
    <section className='pt-6 md:hidden'>
      <ul className='divide-y rounded-lg border overflow-hidden'>
        {items.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <li key={id}>
              <button
                type='button'
                onClick={() => handleSelect(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left
                  ${isActive ? 'bg-primary-150 text-primary-200 font-medium' : 'bg-white text-gray-800'}`}
              >
                <Icon className='w-5 h-5 text-gray-500' />
                <span className='truncate'>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {isAuthenticated && (
        <button
          className='mt-6 w-full py-3 bg-gray-100 text-center font-medium text-sm rounded-lg'
          onClick={logout}
        >
          로그아웃
        </button>
      )}
    </section>
  );
}
