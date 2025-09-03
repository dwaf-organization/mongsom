import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

export default function Nav() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const handleLogout = () => {
    window.logout();
    addToast('로그아웃에 성공했습니다.', 'success');
    navigate('/login');
  };
  return (
    <nav className='flex justify-between items-center h-full w-full font-pretendard font-medium'>
      <ul className='grid grid-cols-4  gap-3 justify-center items-center h-full'>
        <li className='text-center'>
          <Link to='/'>홈</Link>
        </li>
        <li className='text-center'>
          <Link to='/brand'>브랜드</Link>
        </li>
        <li className='text-center'>
          <Link to='/shop'>상품</Link>
        </li>
        <li className='text-center'>
          <Link to='/notice'>공지사항</Link>
        </li>
      </ul>

      <ul className='flex gap-3 h-full items-center'>
        {window.isAuthenticated() ? (
          <>
            <li className='text-center'>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
            <li className='text-center'>
              <Link to='/mypage'>마이페이지</Link>
            </li>
            <li className='text-center'>
              <Link to='/cart'>장바구니</Link>
            </li>
          </>
        ) : (
          <>
            <li className='text-center'>
              <Link to='/login'>로그인</Link>
            </li>
            <li className='text-center'>
              <Link to='/signup'>회원가입</Link>
            </li>
            <li className='text-center'>
              <Link to='/cart'>장바구니</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
