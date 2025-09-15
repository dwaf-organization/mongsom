import { useSearchParams } from 'react-router-dom';

import { mypageReviewTabs } from '../../../constants/tabs';
import MyReviewTabWrapper from '../../section/mypage/MyReviewTabWrapper';

export default function MyReviewManagementTab({ activeMyreview }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('myreview') || 'reviewWrite';

  const handleTabChange = tabId => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('myreview', tabId);
      return newParams;
    });
  };

  return (
    <>
      <div className='flex items-center justify-center'>
        {mypageReviewTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
               border border-black-100 mt-6 px-6 py-2 w-full transition-colors duration-200 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'bg-primary-100 font-semibold'
                  : ' hover:bg-primary-150'
              }
           
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <MyReviewTabWrapper myreview={activeMyreview} />
    </>
  );
}
