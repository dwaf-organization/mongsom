import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../Pagination';
import CreateReviewButton from './CreateReviewButton';
import { useAuth } from '../../../context/AuthContext';
import { getReviewWriteList } from '../../../api/review';
import { pickFirstImageUrl } from '../../../utils/dateUtils';
import { formatDate } from '../../../utils/dateUtils';

export default function MyReviewWriteTab() {
  const { userCode } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');

  const [reviewWriteList, setReviewWriteList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userCode) {
      setReviewWriteList([]);
      setLoading(false);
      return;
    }

    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getReviewWriteList(userCode, page, 8);
        const payload =
          res?.data && typeof res.data === 'object' ? res.data : res;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        const pgn = payload?.pagination || {};

        if (!cancel) {
          setReviewWriteList(items);
          setPagination({
            currentPage: Number(pgn.currentPage ?? page ?? 1),
            totalPage: Number(pgn.totalPage ?? 1),
          });
        }
      } catch (e) {
        console.error('리뷰 작성 목록 조회 실패:', e);
        if (!cancel) {
          setReviewWriteList([]);
          setPagination({ currentPage: 1, totalPage: 1 });
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [userCode, page]);

  if (loading) {
    return <div className='py-6 text-center text-gray-500'>불러오는 중…</div>;
  }

  if (!reviewWriteList.length) {
    return (
      <div className='py-6 text-center text-gray-500'>
        작성 가능한 리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div>
      <p className='text-xl font-semibold text-left mt-8 px-4 pb-4 border-b border-black-100'>
        리뷰 작성
      </p>

      <ul>
        {reviewWriteList.map(item => {
          // 백엔드 필드 매핑
          const id = item.orderDetailId; // 리뷰 작성 기준 키
          const image = pickFirstImageUrl(item.productImgUrls);
          const name = item.productName ?? '-';
          const option = item.optName ?? '-';
          const paymentAt = item.paymentAt;
          const canWrite = Number(item.reviewStatus) === 0; // 0: 미작성

          return (
            <li key={id} className='border-b border-gray-400'>
              <div className='flex items-start gap-4 py-4'>
                <img
                  src={image}
                  alt={name}
                  className='w-[80px] h-[80px] object-cover rounded-lg'
                />

                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-gray-900'>{name}</p>
                  </div>
                  <p className='text-sm text-gray-600 mb-2 text-left'>
                    옵션: {option}
                  </p>
                  <p className='font-montserrat text-left text-sm text-gray-500'>
                    주문 일자 : {formatDate(paymentAt)}
                  </p>
                </div>

                {/* 리뷰 버튼: 미작성일 때만 노출 */}
                {canWrite ? (
                  <CreateReviewButton id={id} />
                ) : (
                  <span className='text-sm text-gray-500 self-center'>
                    작성 완료
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Pagination totalPage={pagination.totalPage} />
    </div>
  );
}
