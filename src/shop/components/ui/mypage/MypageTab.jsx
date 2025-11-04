import { useSearchParams } from 'react-router-dom';

import { mypageTabs } from '../../../constants/tabs';

export default function MypageTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || '';

  const handleTabChange = tabId => {
    setSearchParams({ tab: tabId });
  };

  return (
    <>
      <div className='items-center justify-center hidden md:flex'>
        {mypageTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              text-gray-600 px-6 py-2 w-full transition-colors duration-200 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? ' text-primary-200'
                  : ' hover:bg-primary-150'
              }
              ${index === 0 ? 'rounded-l-lg' : ''}
              ${index === mypageTabs.length - 1 ? 'rounded-r-lg' : ''}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}
