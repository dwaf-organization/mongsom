import { Link, useLocation } from 'react-router-dom';

import { ActiveShopping, Shopping } from '../../asset/icons/Shopping';
import { ActiveHome, Home } from '../../asset/icons/Home';
import { MyPage, ActiveMyPage } from '../../asset/icons/MyPage';
import { Brand, ActiveBrand } from '../../asset/icons/Brand';

export default function MobileNav() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isNotice = pathname.startsWith('/notice');
  const isMy = pathname.startsWith('/mypage');

  const base =
    'flex flex-col items-center justify-center gap-1 transition-colors';

  const activeTxt = 'text-black-100';
  const inactiveTxt = 'text-gray-700';

  return (
    <nav className='fixed bottom-0 left-0 z-40 w-full bg-white shadow-md border-t border-gray-200 md:hidden'>
      <ul className='flex justify-around items-center py-3 font-pretendard font-medium text-xs border-t border-gray-500'>
        <li>
          <Link
            to='/'
            className={`${base} ${isHome ? activeTxt : inactiveTxt}`}
            aria-current={isHome ? 'page' : undefined}
          >
            {isHome ? <ActiveHome /> : <Home />}
            <span>홈</span>
          </Link>
        </li>

        <li>
          <Link
            to='/shop'
            className={`${base} ${isShop ? activeTxt : inactiveTxt}`}
            aria-current={isShop ? 'page' : undefined}
          >
            {isShop ? <ActiveShopping /> : <Shopping />}
            <span>상품</span>
          </Link>
        </li>

        <li>
          <Link
            to='/notice'
            className={`${base} ${isNotice ? activeTxt : inactiveTxt}`}
            aria-current={isNotice ? 'page' : undefined}
          >
            {/* 여기서만 아이콘 자체를 교체 */}
            {isNotice ? <ActiveBrand /> : <Brand />}
            <span>공지</span>
          </Link>
        </li>

        <li>
          <Link
            to='/mypage'
            className={`${base} ${isMy ? activeTxt : inactiveTxt}`}
            aria-current={isMy ? 'page' : undefined}
          >
            {isMy ? <ActiveMyPage /> : <MyPage />}
            <span>마이페이지</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
