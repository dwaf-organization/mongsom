import { useSearchParams } from 'react-router-dom';
import InnerPaddingSectionWrapper from '../../../wrapper/InnerPaddingSectionWrapper';

export default function ShopDetailTabSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';

  const tabs = [
    { id: 'info', label: '상품정보' },
    { id: 'review', label: '리뷰' },
    { id: 'exchange', label: '교환/반품' },
  ];

  const handleTabChange = tabId => {
    setSearchParams({ tab: tabId });
  };

  return (
    <InnerPaddingSectionWrapper>
      <div className='flex items-center justify-center'>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              text-gray-600 px-6 py-2 w-full transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'bg-black-100 text-white'
                  : 'bg-primary-100 hover:bg-primary-150'
              }
              ${index === 0 ? 'rounded-l-lg' : ''}
              ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </InnerPaddingSectionWrapper>
  );
}
