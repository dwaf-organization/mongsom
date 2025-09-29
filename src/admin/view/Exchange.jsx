import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ExchangeTabSection from '../components/section/exchange/ExchangeTabSection';
import ExchangeTableSection from '../components/section/exchange/ExchangeTableSection';
import Pagination from '../components/ui/Pagination';
import { getExchangeList } from '../api/exchange';

export default function Exchange() {
  const [tab] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const activeTab = tab.get('tab') || 'exchange';

  useEffect(() => {
    if (activeTab === 'exchange') {
      getExchangeList(1, 1).then(res => {
        setPagination(res.pagination);
      });
    } else {
      getExchangeList(2, 1).then(res => {
        setPagination(res.pagination);
      });
    }
  }, [activeTab]);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>교환/반품</h2>
      <ExchangeTabSection />
      <ExchangeTableSection activeTab={activeTab} />
      <Pagination totalPage={pagination.totalPage} />
    </InnerPaddingSectionWrapper>
  );
}
