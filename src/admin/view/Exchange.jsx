import { useSearchParams } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ExchangeTabSection from '../components/section/exchange/ExchangeTabSection';
import ExchangeTableSection from '../components/section/exchange/ExchangeTableSection';

export default function Exchange() {
  const [tab] = useSearchParams();
  const activeTab = tab.get('tab') || 'exchange';
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>교환/반품</h2>
      <ExchangeTabSection />
      <ExchangeTableSection activeTab={activeTab} />
    </InnerPaddingSectionWrapper>
  );
}
