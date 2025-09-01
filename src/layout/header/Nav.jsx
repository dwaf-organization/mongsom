import { Link } from 'react-router-dom';

export default function Nav() {
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

      <ul className='grid grid-cols-2 gap-3 h-ful'>
        <li className='text-center'>
          <Link to='/login'>로그인 /</Link>
          <Link to='/signup'>회원가입</Link>
        </li>
        <li className='text-center'>
          <Link to='/cart'>장바구니</Link>
        </li>
      </ul>
    </nav>
  );
}
