import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ExchangeTabSection from '../components/section/exchange/ExchangeTabSection';
import ExchangeTableSection from '../components/section/exchange/ExchangeTableSection';
import Pagination from '../components/ui/Pagination';
import { getExchangeList } from '../api/exchange';

export default function Exchange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exchangeList, setExchangeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'exchange';
  const currentPage = Number(searchParams.get('page') || 1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {
    const type = activeTab === 'exchange' ? 1 : 2;
    setLoading(true);
    getExchangeList(type, currentPage)
      .then(res => {
        const items = Array.isArray(res?.changeItems)
          ? res.changeItems
          : Array.isArray(res?.changeItems)
            ? res.changeItems
            : [];
        const pagination = res?.pagination ?? {
          currentPage: currentPage,
          totalPage: Number(res?.totalPage ?? 1),
        };
        setExchangeList(items);
        setPagination(pagination);
        console.log('🚀 ~ Exchange ~ items.pagination:', pagination);
      })
      .catch(() => {
        setExchangeList([]);
        setPagination({ currentPage, totalPage: 1 });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, currentPage]);

  const handleTabChange = tabKey => {
    setSearchParams({ tab: tabKey, page: '1' });
  };

  if (loading) {
    return <div>교환/반품 내역을 불러오는 중입니다.</div>;
  }

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>교환/반품</h2>
      <ExchangeTabSection activeTab={activeTab} onChangeTab={handleTabChange} />

      <ExchangeTableSection activeTab={activeTab} exchangeList={exchangeList} />
      {exchangeList.length === 0 && !loading && (
        <p className='text-center text-gray-500 my-10'>
          교환/반품 내역이 없습니다.
        </p>
      )}

      <Pagination totalPage={pagination.totalPage} />
    </InnerPaddingSectionWrapper>
  );
}
