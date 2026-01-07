import { useState, useEffect } from 'react';
import { getCompletedReviewList } from '../../../api/review';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../Pagination';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import { pickFirstImageUrl } from '../../../utils/dateUtils';
import { useModal } from '../../../context/ModalContext';
import ReviewDeleteModal from './ReviewDeleteModal';

export default function CompletedReviewTab() {
  const { userCode } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '0');
  const { openModal } = useModal();

  const [expandedReviews, setExpandedReviews] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  useEffect(() => {
    if (!userCode) {
      setReviews([]);
      setPagination({ currentPage: 1, totalPage: 1 });
      setLoading(false);
      return;
    }

    let cancel = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getCompletedReviewList(userCode, page, 8);
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
        console.error('작성한 리뷰 목록 조회 실패:', e);
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
  }, [userCode, page]);

  const renderStars = rating => {
    const r = Number(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < r ? 'text-primary-200' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const handleDeleteReview = reviewId => {
    openModal(<ReviewDeleteModal reviewId={reviewId} userCode={userCode} />);
  };

  const toggleReviewExpansion = reviewKey => {
    setExpandedReviews(prev => ({ ...prev, [reviewKey]: !prev[reviewKey] }));
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    const s = String(text);
    return s.length <= maxLength ? s : s.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section>
        <h2 className='text-xl text-start font-semibold text-gray-800 border-b border-black-100 pb-4 mt-8 px-4'>
          작성한 리뷰
        </h2>
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section>
        <h2 className='text-xl text-start font-semibold text-gray-800 border-b border-black-100 pb-4 mt-8 px-4'>
          작성한 리뷰 0
        </h2>
        <div className='py-6 text-center text-gray-500'>
          작성한 리뷰가 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section>
      <p className='text-lg md:text-xl font-semibold text-left mt-8 md:px-4 pb-2 md:pb-4 border-b border-black-100'>
        작성한 리뷰 {reviews.length}
      </p>

      <ul>
        {reviews.map(review => {
          const firstImg = pickFirstImageUrl(review.productImgUrls);
          return (
            <li
              key={review.reviewId}
              className='border-b-2 border-gray-50 py-6 last:border-b-0'
            >
              <div className='flex items-center justify-between mb-2 border-b w-full border-gray-300 pb-4 '>
                <div className='flex items-center gap-4'>
                  <Link to={`/shop-detail/${review.productId}`}>
                    {firstImg ? (
                      <img
                        src={firstImg}
                        alt={review.productName}
                        className='w-[100px] h-[100px] object-cover rounded-lg'
                      />
                    ) : (
                      <div className='w-[80px] h-[80px] bg-gray-100' />
                    )}
                  </Link>
                  <div>
                    <p className='text-gray-800 truncate max-w-[7rem] md:max-w-[300px]'>
                      {review.productName ?? review.name ?? '상품명'}
                    </p>
                    <p className='text-gray-800 text-sm truncate max-w-[7rem] md:max-w-[300px]'>
                      옵션: {review.option1Name ?? '-'} /{' '}
                      {review.option2Name ?? '-'}
                    </p>
                  </div>
                </div>
                <button
                  className='text-primary-200 cursor-pointer select-none'
                  onClick={() => handleDeleteReview(review.reviewId)}
                >
                  삭제
                </button>
              </div>

              <article className='px-2'>
                <header className='flex items-center gap-1 mb-2'>
                  <div>{renderStars(review.reviewRating)}</div>

                  <time className='text-sm text-black-100 font-montserrat px-2'>
                    {formatDate(review.reviewCreatedAt)}
                  </time>
                </header>

                <p className=' font-montserrat text-start'>
                  {expandedReviews[review.reviewId]
                    ? review.reviewContent
                    : truncateText(review.reviewContent)}
                  {String(review.reviewContent).length > 20 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.reviewId)}
                      className='text-gray-500 hover:text-primary-200 text-sm mt-1 ml-2'
                    >
                      {expandedReviews[review.reviewId] ? '접기' : '더보기'}
                    </button>
                  )}
                </p>

                {Array.isArray(review.reviewImgUrls) &&
                  review.reviewImgUrls.length > 0 && (
                    <figure className='flex items-center justify-start gap-1 mt-2'>
                      {review.reviewImgUrls.map((image, i) =>
                        typeof image === 'string' ? (
                          <img
                            key={i}
                            src={image}
                            alt={`리뷰 이미지 ${i + 1}`}
                            className='max-w-[70px] max-h-[70px] object-cover'
                          />
                        ) : null,
                      )}
                    </figure>
                  )}
              </article>
            </li>
          );
        })}
      </ul>

      <Pagination totalPage={pagination.totalPage} />
    </section>
  );
}
