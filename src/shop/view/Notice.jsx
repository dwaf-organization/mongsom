import { useEffect, useState, useMemo } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import Pagination from '../components/ui/Pagination';
import { getNotice } from '../api/notice';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Notice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = useMemo(
    () => Number(searchParams.get('page') || 0),
    [searchParams],
  );
  const pageSize = useMemo(
    () => Number(searchParams.get('size') || 10),
    [searchParams],
  );

  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getNotice(currentPage, pageSize);

        const data = res;
        const items = Array.isArray(data.items)
          ? data.items
          : Array.isArray(data)
            ? data
            : [];

        const pg = data?.pagination ?? {
          currentPage: currentPage,
          totalPage: Number(data?.totalPage ?? 1),
        };

        if (!cancelled) {
          setNotices(items);
          setPagination({
            currentPage: Number(pg.currentPage || currentPage),
            totalPage: Number(pg.totalPage || 1),
          });
        }
      } catch (e) {
        console.error('공지 로드 실패:', e);
        if (!cancelled) {
          setNotices([]);
          setPagination({ currentPage, totalPage: 1 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPage, pageSize]);

  const sevenDaysAgoTs = (() => {
    const now = new Date();
    return now.getTime() - 7 * 24 * 60 * 60 * 1000;
  })();

  const isRecent = value => {
    if (!value) return false;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return false;
    return d.getTime() >= sevenDaysAgoTs;
  };

  const formatDate = d => (d ? String(d).slice(0, 10) : '');

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-700 pb-4'>
        공지사항
      </h2>
      {notices.length === 0 && !loading && (
        <p className='text-center text-gray-500 my-10'>공지사항이 없습니다.</p>
      )}
      {/* 데스크톱/태블릿 테이블 레이아웃 */}
      {!loading && notices.length > 0 && (
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-sm text-[#3A3A3A] min-w-[600px]'>
            <thead>
              <tr className='grid grid-cols-12 border-b border-gray-400 py-3 gap-2'>
                <th className='col-span-1 text-center font-montserrat font-medium'>
                  NO
                </th>
                <th className='col-span-6 text-center font-medium'>제목</th>
                <th className='col-span-2 text-center font-medium'>글쓴이</th>
                <th className='col-span-3 text-center font-medium'>날짜</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((item, index) => {
                const id = item?.id ?? item?.noticeId ?? index;
                const dateRaw = item?.date ?? item?.createdAt;
                const recent = isRecent(dateRaw);

                return (
                  <tr
                    key={id}
                    onClick={() => navigate(`/notice-detail/${id}`)}
                    className={[
                      'grid grid-cols-12 border-b border-gray-400 py-3 cursor-pointer hover:bg-gray-50 gap-2 transition-colors',
                      recent ? 'bg-secondary-100' : '',
                    ].join(' ')}
                  >
                    <td className='col-span-1 text-center font-montserrat font-medium'>
                      {item?.id ?? item?.noticeId ?? index + 1}
                    </td>
                    <td className='col-span-6 text-start font-montserrat font-medium pl-4 truncate'>
                      {item?.title ?? item?.subject ?? '(제목 없음)'}
                    </td>
                    <td className='col-span-2 text-center font-montserrat font-medium'>
                      {item?.writer ?? item?.author ?? '관리자'}
                    </td>
                    <td className='col-span-3 text-center font-montserrat font-medium truncate'>
                      {formatDate(dateRaw)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 모바일 카드 레이아웃 */}
      {!loading && notices.length > 0 && (
        <div className='block md:hidden space-y-2'>
          {notices.map((item, index) => {
            const id = item?.id ?? item?.noticeId ?? index;
            const dateRaw = item?.date ?? item?.createdAt;
            const recent = isRecent(dateRaw);

            return (
              <div
                key={id}
                onClick={() => navigate(`/notice-detail/${id}`)}
                className={[
                  'border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow',
                  recent ? 'bg-secondary-50 border-secondary-200' : 'bg-white',
                ].join(' ')}
              >
                <div className='flex justify-between items-start mb-2'>
                  <span className='text-xs font-montserrat font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                    NO. {item?.id ?? item?.noticeId ?? index + 1}
                  </span>
                  <span className='text-xs font-montserrat text-gray-500'>
                    {formatDate(dateRaw)}
                  </span>
                </div>
                <h3 className='font-montserrat font-medium text-[#3A3A3A] mb-2 leading-5'>
                  {item?.title ?? item?.subject ?? '(제목 없음)'}
                </h3>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-600'>
                    작성자: {item?.writer ?? item?.author ?? '관리자'}
                  </span>
                  {recent && (
                    <span className='text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded'>
                      NEW
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        // currentPage={pagination.currentPage}
        totalPage={pagination.totalPage}
      />
    </InnerPaddingSectionWrapper>
  );
}
