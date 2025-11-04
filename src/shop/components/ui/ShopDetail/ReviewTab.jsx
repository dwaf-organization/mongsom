import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsReviewList } from '../../../api/review';
import { formatDate } from '../../../utils/dateUtils';
import Pagination from '../Pagination';

export default function ReviewTab() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');

  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        setLoading(true);

        const res = await getProductsReviewList(id, page);

        const payload =
          res?.data && typeof res.data === 'object' ? res.data : res;

        const items = Array.isArray(payload?.items) ? payload.items : [];
        const pgn = payload?.pagination || {};

        if (!cancel) {
          setReviews(items);
          setPagination({
            currentPage: Number(pgn.currentPage ?? page ?? 1),
            totalPage: Number(pgn.totalPage ?? 1),
          });
        }
      } catch (e) {
        console.error('상품 리뷰 목록 조회 실패:', e);
        if (!cancel) {
          setReviews([]);
          setPagination({ currentPage: 1, totalPage: 1 });
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [id, page]);

  const renderStars = rating => {
    const r = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < r ? 'text-primary-200' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const toggleReviewExpansion = key => {
    setExpandedReviews(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    const s = String(text);
    return s.length <= maxLength ? s : s.slice(0, maxLength) + '...';
  };

  const safeImages = arr =>
    Array.isArray(arr) ? arr.filter(u => typeof u === 'string') : [];

  if (loading) {
    return <div className='py-6 text-center text-gray-500'>불러오는 중…</div>;
  }

  if (!reviews.length) {
    return (
      <div className='py-6 text-center text-gray-500'>리뷰가 없습니다.</div>
    );
  }

  return (
    <div>
      <div className='bg-white rounded-lg'>
        <p className='md:text-xl text-start font-semibold text-gray-800'>
          리뷰 {reviews.length} 건
        </p>

        <div>
          {reviews.map((review, idx) => {
            const key = review.reviewId ?? `r-${idx}`;

            const rating = review.reviewRating ?? 0;

            const content = review.reviewContent ?? '';

            const date = review.createdAt ?? '';

            const images =
              safeImages(review.reviewImgUrls) || safeImages(review.images);

            return (
              <div
                key={key}
                className='border-t border-gray-300 py-6 last:border-b-0'
              >
                <div className='flex items-center px-2'>
                  <ul className='flex flex-col items-start md:text-lg gap-2'>
                    <li className='text-gray-500'>
                      {review.userName
                        ? review.userName.charAt(0) +
                          '*'.repeat(Math.max(0, review.userName.length - 1))
                        : ''}
                    </li>
                    <li className='text-sm md:text-lg text-gray-500 font-montserrat w-full whitespace-nowrap'>
                      {formatDate(date)}
                    </li>
                  </ul>

                  <div className='flex flex-col items-start justify-start px-16 gap-1 w-full'>
                    <div className='flex items-center justify-start gap-1'>
                      <p>{renderStars(rating)}</p>
                      <span className='text-sm text-black-100 font-montserrat px-2'>
                        {Number(rating) || 0}
                      </span>
                    </div>

                    <div className='text-gray-500 font-montserrat text-start'>
                      <p>
                        {expandedReviews[key] ? content : truncateText(content)}
                      </p>
                      {String(content).length > 20 && (
                        <button
                          onClick={() => toggleReviewExpansion(key)}
                          className='text-gray-500 hover:text-primary-200 text-sm mt-1'
                        >
                          {expandedReviews[key] ? '접기' : '더보기'}
                        </button>
                      )}
                    </div>

                    {images.length > 0 && (
                      <div className='flex items-center justify-start gap-1'>
                        {images.map((image, i) => (
                          <img
                            key={i}
                            src={image}
                            alt={`review-${key}-${i}`}
                            className='w-[4.1rem] h-[4.1rem] object-cover'
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination totalPage={pagination.totalPage} />
      </div>
    </div>
  );
}
