import { useEffect, useState, useMemo } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import Pagination from '../components/ui/Pagination';
import { getNotice } from '../api/notice';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function NoticeList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = useMemo(
    () => Number(searchParams.get('page') || 1),
    [searchParams],
  );
  const pageSize = useMemo(
    () => Number(searchParams.get('size') || 10),
    [searchParams],
  );

  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
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
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>공지 목록</h2>

      {!loading && notices.length > 0 && (
        <table className='w-full text-sm text-[#3A3A3A]'>
          <thead>
            <tr className='flex justify-between border-b border-gray-400 py-3 border-t '>
              <th className='text-center font-montserrat font-medium w-full max-w-[100px]'>
                NO
              </th>
              <th className='text-center font-medium w-full max-w-[280px]'>
                제목
              </th>
              <th className='text-center font-medium w-full max-w-[120px]'>
                글쓴이
              </th>
              <th className='text-center font-medium w-full max-w-[120px] pr-8'>
                날짜
              </th>
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
                  onClick={() => navigate(`/admin/notice-detail/${id}`)}
                  className={[
                    'flex justify-between border-b border-gray-400 py-3 cursor-pointer',
                    recent ? 'bg-secondary-100' : '',
                  ].join(' ')}
                >
                  <td className='text-center font-montserrat font-medium w-full max-w-[100px]'>
                    {item?.id ?? item?.noticeId ?? index + 1}
                  </td>
                  <td className='text-start font-montserrat font-medium w-full pl-4 truncate max-w-[280px]'>
                    {item?.title ?? item?.subject ?? '(제목 없음)'}
                  </td>
                  <td className='text-center font-montserrat font-medium w-full max-w-[120px]'>
                    {item?.writer ?? item?.author ?? '관리자'}
                  </td>
                  <td className='text-center font-montserrat font-medium w-full max-w-[120px] pr-8'>
                    {formatDate(dateRaw)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Pagination
        currentPage={pagination.currentPage}
        totalPage={pagination.totalPage}
      />
    </InnerPaddingSectionWrapper>
  );
}
