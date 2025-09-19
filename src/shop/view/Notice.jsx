import { useEffect, useState, useMemo } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import Pagination from '../components/ui/Pagination';
import { getNotice } from '../api/notice';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Notice() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = useMemo(
    () => Number(searchParams.get('page') || 1),
    [searchParams],
  );
  const pageSize = useMemo(
    () => Number(searchParams.get('size') || 5),
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

  const formatDate = d => (d ? String(d).slice(0, 10) : '');

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-700 pb-4'>
        공지사항
      </h2>

      {loading ? (
        <div className='py-20 text-center text-gray-500'>불러오는 중…</div>
      ) : notices.length === 0 ? (
        <div className='py-20 text-center text-gray-500'>
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <table className='w-full bg-secondary-100/80 text-sm text-[#3A3A3A]'>
          <thead>
            <tr className='flex justify-between border-b border-gray-400 py-3'>
              <th className='text-center font-montserrat font-medium w-full max-w-[100px]'>
                NO
              </th>
              <th className='text-center font-medium w-full'>제목</th>
              <th className='text-center font-medium w-full max-w-[120px]'>
                글쓴이
              </th>
              <th className='text-center font-medium w-full max-w-[120px] pr-8'>
                날짜
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.map((item, index) => (
              <tr
                key={item?.id ?? item?.noticeId ?? index}
                className='flex justify-between border-b border-gray-400 py-3 cursor-pointer'
                onClick={() =>
                  navigate(
                    `/notice-detail/${item?.id ?? item?.noticeId ?? index}`,
                  )
                }
              >
                <td className='text-center font-montserrat font-medium w-full max-w-[100px]'>
                  {item?.id ?? item?.noticeId ?? index + 1}
                </td>
                <td className='text-start font-montserrat font-medium w-full pl-4 truncate'>
                  {item?.title ?? item?.subject ?? '(제목 없음)'}
                </td>
                <td className='text-center font-montserrat font-medium w-full max-w-[120px]'>
                  {item?.writer ?? item?.author ?? '관리자'}
                </td>
                <td className='text-center font-montserrat font-medium w-full max-w-[120px] pr-8'>
                  {formatDate(item?.date ?? item?.createdAt)}
                </td>
              </tr>
            ))}
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
