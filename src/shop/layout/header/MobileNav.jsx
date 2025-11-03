import { Link } from 'react-router-dom';

import Shopping from '../../asset/icons/Shopping';
import Home from '../../asset/icons/Home';
import MyPage from '../../asset/icons/MyPage';

export default function MobileNav() {
  return (
    <nav className='fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 md:hidden'>
      <ul className='flex justify-around items-center py-3 font-pretendard font-medium text-xs text-gray-700 bg-primary-100'>
        <li>
          <Link
            to='/'
            className='flex flex-col items-center justify-center gap-1'
          >
            <Home />
            <span>홈</span>
          </Link>
        </li>

        <li>
          <Link
            to='/shop'
            className='flex flex-col items-center justify-center gap-1'
          >
            <Shopping />
            <span>상품</span>
          </Link>
        </li>

        <li>
          <Link
            to='/mypage'
            className='flex flex-col items-center justify-center gap-1'
          >
            <MyPage />
            <span>마이페이지</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
