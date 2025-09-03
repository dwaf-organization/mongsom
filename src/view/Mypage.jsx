import { Link } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import MypageTab from '../components/ui/mypage/MypageTab';

export default function Mypage() {
  return (
    <InnerPaddingSectionWrapper>
      <div className='flex items-center justify-between border-b border-black-100 pb-4'>
        <Link to='/mypage' className='text-2xl font-semibold font-montserrat'>
          My Page
        </Link>
        <MypageTab />
      </div>
    </InnerPaddingSectionWrapper>
  );
}
