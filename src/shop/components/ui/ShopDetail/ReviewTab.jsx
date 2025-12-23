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

  // 이미지 모달 관련 state
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReviewImages, setCurrentReviewImages] = useState([]);

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // ESC 키로 모달 닫기, 좌우 화살표로 이미지 이동
  useEffect(() => {
    const handleKeyDown = e => {
      if (!isModalOpen) return;

      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, currentImageIndex, currentReviewImages.length]);

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

  const openImageModal = (imageSrc, reviewImages) => {
    const imageIndex = reviewImages.findIndex(img => img === imageSrc);
    setCurrentReviewImages(reviewImages);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setCurrentImageIndex(0);
    setCurrentReviewImages([]);
  };

  const goToPreviousImage = () => {
    if (currentReviewImages.length > 1) {
      const newIndex =
        currentImageIndex > 0
          ? currentImageIndex - 1
          : currentReviewImages.length - 1;
      setCurrentImageIndex(newIndex);
      setModalImage(currentReviewImages[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (currentReviewImages.length > 1) {
      const newIndex =
        currentImageIndex < currentReviewImages.length - 1
          ? currentImageIndex + 1
          : 0;
      setCurrentImageIndex(newIndex);
      setModalImage(currentReviewImages[newIndex]);
    }
  };

  const handleModalBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  const truncateText = (text, mobileMaxLength = 15, desktopMaxLength = 30) => {
    if (!text) return '';
    const s = String(text);
    const maxLength = isMobile ? mobileMaxLength : desktopMaxLength;
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
                    <li className='text-black-100 font-montserrat font-semibold w-full'>
                      {review.userName
                        ? review.userName.charAt(0) +
                          '*'.repeat(Math.max(0, review.userName.length - 1))
                        : ''}
                    </li>
                    <li className='text-sm md:text-lg text-gray-500 font-montserrat w-full whitespace-nowrap'>
                      {formatDate(date)}
                    </li>
                  </ul>

                  <div className='flex flex-col items-start justify-start pl-12 md:px-16 gap-1 w-full'>
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
                      {String(content).length > (isMobile ? 15 : 30) && (
                        <button
                          onClick={() => toggleReviewExpansion(key)}
                          className='text-gray-500 hover:text-primary-200 text-sm mt-1'
                        >
                          {expandedReviews[key] ? '접기' : '더보기'}
                        </button>
                      )}
                    </div>

                    {images.length > 0 && (
                      <div className='flex items-center justify-start gap-1 overflow-x-auto'>
                        {images.map((image, i) => (
                          <img
                            key={i}
                            src={image}
                            alt={`review-${key}-${i}`}
                            className={`
                              object-cover rounded cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0
                              ${images.length === 1 ? 'w-16 h-16 md:w-[4.1rem] md:h-[4.1rem]' : ''}
                              ${images.length === 2 ? 'w-14 h-14 md:w-[4.1rem] md:h-[4.1rem]' : ''}
                              ${images.length >= 3 ? 'w-12 h-12 md:w-[4.1rem] md:h-[4.1rem]' : ''}
                            `}
                            onClick={() => openImageModal(image, images)}
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

      {/* 이미지 모달 */}
      {isModalOpen && modalImage && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={handleModalBackgroundClick}
        >
          <div className='relative flex items-center justify-center gap-4 md:gap-8 max-w-full max-h-full'>
            {/* 이전 버튼 (이미지 바깥쪽) */}
            {currentReviewImages.length > 1 && (
              <button
                onClick={goToPreviousImage}
                className='text-white text-2xl md:text-4xl bg-black bg-opacity-50 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all flex-shrink-0'
              >
                ‹
              </button>
            )}

            {/* 이미지 컨테이너 */}
            <div className='relative'>
              <div className='w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-2xl'>
                <img
                  src={modalImage}
                  alt='확대된 리뷰 이미지'
                  className='w-full h-full object-cover'
                />
              </div>

              {/* 이미지 카운터 */}
              {currentReviewImages.length > 1 && (
                <div className='absolute -bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-70 px-3 py-1 rounded-full text-xs md:text-sm'>
                  {currentImageIndex + 1} / {currentReviewImages.length}
                </div>
              )}

              {/* 닫기 버튼 (이미지 바깥쪽 오른쪽 위) */}
              <button
                onClick={closeImageModal}
                className='absolute -top-8 -right-8 md:-top-12 md:-right-12 text-white text-lg md:text-2xl bg-black bg-opacity-70 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all z-10'
              >
                ×
              </button>
            </div>

            {/* 다음 버튼 (이미지 바깥쪽) */}
            {currentReviewImages.length > 1 && (
              <button
                onClick={goToNextImage}
                className='text-white text-2xl md:text-4xl bg-black bg-opacity-50 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all flex-shrink-0'
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
