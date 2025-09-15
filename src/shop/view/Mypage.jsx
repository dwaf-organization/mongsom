import { Link } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import MypageTab from '../components/ui/mypage/MypageTab';
import MyPageTabWrapper from '../components/section/mypage/MyPageTabWrapper';
import { useSearchParams } from 'react-router-dom';

export default function Mypage() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || '';
  const activeMyreview = searchParams.get('myreview') || '';

  return (
    <InnerPaddingSectionWrapper>
      <div className='flex items-center justify-between border-b border-black-100 pb-4'>
        <Link to='/mypage' className='text-2xl font-semibold font-montserrat'>
          My Page
        </Link>
        <MypageTab />
      </div>
      <MyPageTabWrapper tab={activeTab} activeMyreview={activeMyreview} />
    </InnerPaddingSectionWrapper>
  );
}
