import Shopping from '../asset/icons/Shopping';
import MyPage from '../asset/icons/MyPage';
import Brand from '../asset/icons/Brand';
import Home from '../asset/icons/Home';

export const mobileNav = [
  {
    id: Home,
    label: '홈',
    path: '/',
    icon: <Home />,
  },
  { id: Shopping, label: '상품', path: '/shop', icon: <Shopping /> },
  { id: Brand, label: '공지', path: '/notice', icon: <Brand /> },
  { id: MyPage, label: '마이페이지', path: '/mypage', icon: <MyPage /> },
];
