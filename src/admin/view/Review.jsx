import React, { useEffect, useState } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import {
  getReviewAllList,
  createReviewAnswer,
} from '../../admin/api/reveiw/index.js';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/ui/Pagination';
import { hiddenReview } from '../../admin/api/reveiw/index.js';
import { deleteReview } from '../../admin/api/reveiw/index.js';
import { useToast } from '../context/ToastContext';
import { useModal } from '../context/ModalContext';
import ReviewDeleteModal from '../components/ui/ReviewDeleteModal.jsx';

// 날짜 포맷 함수
const formatDate = dateString => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 별점 렌더링 함수
const renderStars = rating => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>,
    );
  }
  return stars;
};

// 텍스트 자르기 함수
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 이미지 배열 안전하게 처리
const safeImages = images => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  return [];
};

export default function Review() {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 0;
  const [pagination, setPagination] = useState();
  const [review, setReviewData] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});

  const { addToast } = useToast();
  const { openModal } = useModal();

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [currentReviewImages, setCurrentReviewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 답변 관련 상태
  const [answerInputs, setAnswerInputs] = useState({});
  const [submittingAnswer, setSubmittingAnswer] = useState(null);

  const fetchData = async () => {
    const response = await getReviewAllList(page);
    if (response.code === 1) {
      setPagination(response.data.pagination);
      setReviewData(response.data.reviews);
    }
    console.log('🚀 ~ fetchData ~ response:', response);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // 리뷰 더보기/접기 토글
  const toggleReviewExpansion = key => {
    setExpandedReviews(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 이미지 모달 열기
  const openImageModal = (image, images) => {
    setModalImage(image);
    setCurrentReviewImages(images);
    setCurrentImageIndex(images.indexOf(image));
    setIsModalOpen(true);
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setCurrentReviewImages([]);
    setCurrentImageIndex(0);
  };

  // 모달 배경 클릭 핸들러
  const handleModalBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  // 이전 이미지
  const goToPreviousImage = () => {
    const newIndex =
      currentImageIndex === 0
        ? currentReviewImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setModalImage(currentReviewImages[newIndex]);
  };

  // 다음 이미지
  const goToNextImage = () => {
    const newIndex =
      currentImageIndex === currentReviewImages.length - 1
        ? 0
        : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setModalImage(currentReviewImages[newIndex]);
  };

  // 답변 입력값 변경
  const handleAnswerChange = (reviewId, value) => {
    setAnswerInputs(prev => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  // 답변 등록
  const handleSubmitAnswer = async reviewId => {
    const answer = answerInputs[reviewId]?.trim();
    if (!answer) return;

    setSubmittingAnswer(reviewId);
    try {
      const response = await createReviewAnswer(reviewId, answer);
      if (response.code === 1) {
        addToast('답변이 등록되었습니다.', 'success');
        await fetchData();
        setAnswerInputs(prev => ({
          ...prev,
          [reviewId]: '',
        }));
      }
    } catch (error) {
      console.error('답변 등록 실패:', error);
    } finally {
      setSubmittingAnswer(null);
    }
  };

  const handleReviewHidden = async (reviewId, adminHidden) => {
    const hiddenStatus = adminHidden === 0 ? 'hide' : 'show';
    try {
      const response = await hiddenReview(hiddenStatus, reviewId);
      if (response.code === 1) {
        await fetchData();
        addToast('처리가 완료되었습니다.', 'success');
      }
    } catch (error) {
      console.error('리뷰 숨김/숨김해제 실패:', error);
    }
  };

  const handleReviewDelete = reviewId => {
    openModal(<ReviewDeleteModal reviewId={reviewId} onSuccess={fetchData} />);
  };
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>리뷰관리</h2>
      <div>
        <div className='bg-white rounded-lg'>
          {/* <p className='md:text-xl text-start font-semibold text-gray-800 mb-4'>
            리뷰 {review?.length || 0} 건
          </p> */}

          <div>
            {review?.map((item, idx) => {
              const key = item.reviewId ?? `r-${idx}`;
              const rating = item.reviewRating ?? 0;
              const content = item.reviewContent ?? '';
              const date = item.createdAt ?? '';
              const images =
                safeImages(item.reviewImgUrls) || safeImages(item.images);

              return (
                <div
                  key={key}
                  className='border-t border-gray-300 py-6 last:border-b-0'
                >
                  <div className='flex items-start px-2'>
                    <ul className='flex flex-col items-start gap-2 min-w-[80px]'>
                      <li className='font-montserrat w-full'>
                        {item.userName
                          ? item.userName.charAt(0) +
                            '*'.repeat(Math.max(0, item.userName.length - 1))
                          : ''}
                      </li>
                      <li className='text-sm text-gray-500 font-montserrat w-full whitespace-nowrap'>
                        {formatDate(date)}
                      </li>
                    </ul>

                    <div className='flex flex-col items-start justify-start pl-12 md:px-16 gap-1 w-full'>
                      {/* 상품 정보 */}
                      <div className='flex items-center justify-between w-full'>
                        <p className='text-sm text-gray-600 mb-1'>
                          {item.productName}
                          {item.optionSummary && (
                            <span className='text-gray-600 ml-2'>
                              ({item.optionSummary})
                            </span>
                          )}
                        </p>
                        <div className='text-sm leading-tight flex items-center gap-1'>
                          <button
                            className='text-gray-700'
                            onClick={() =>
                              handleReviewHidden(
                                item.reviewId,
                                item.adminHidden,
                              )
                            }
                          >
                            {item.adminHidden === 0 ? '숨김' : '숨김해제'} |
                          </button>
                          <button
                            className='text-red-500'
                            onClick={() => handleReviewDelete(item.reviewId)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      {/* 별점 */}
                      <div className='flex items-center justify-start gap-1'>
                        <p>{renderStars(rating)}</p>
                        <span className='text-sm text-black-100 font-montserrat px-2'>
                          {Number(rating) || 0}
                        </span>
                      </div>

                      {/* 리뷰 내용 */}
                      <div className='font-montserrat text-start'>
                        <p>
                          {expandedReviews[key]
                            ? content
                            : truncateText(content)}
                        </p>
                        {String(content).length > 50 && (
                          <button
                            onClick={() => toggleReviewExpansion(key)}
                            className='text-gray-500 hover:text-primary-200 text-sm mt-1'
                          >
                            {expandedReviews[key] ? '접기' : '더보기'}
                          </button>
                        )}
                      </div>

                      {/* 이미지 */}
                      {images.length > 0 && (
                        <div className='flex items-center justify-start gap-1 overflow-x-auto mt-2'>
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

                  {/* 관리자 답변 또는 답변 입력 */}
                  {item.adminAnswer ? (
                    <div className='mt-4 px-2 flex items-start'>
                      <div className='min-w-[80px]'>
                        <p className='text-sm font-semibold text-gray-700'>
                          판매자
                        </p>
                        <p className='text-sm text-gray-400'>
                          ({item.adminAnswerAt})
                        </p>
                      </div>
                      <div className='flex-1 pl-12 md:px-16'>
                        <p className='text-sm bg-gray-100 p-3 rounded-xl whitespace-pre-line'>
                          {item.adminAnswer}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='mt-4 px-2 flex items-start'>
                      <p className='text-sm font-semibold text-gray-700 min-w-[80px]'>
                        답변
                      </p>
                      <div className='flex-1 pl-12 md:px-16'>
                        <textarea
                          value={answerInputs[item.reviewId] || ''}
                          onChange={e =>
                            handleAnswerChange(item.reviewId, e.target.value)
                          }
                          placeholder='답변을 입력해주세요'
                          className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-200'
                          rows={3}
                        />
                        <div className='flex justify-end mt-2'>
                          <button
                            onClick={() => handleSubmitAnswer(item.reviewId)}
                            disabled={
                              submittingAnswer === item.reviewId ||
                              !answerInputs[item.reviewId]?.trim()
                            }
                            className='px-4 py-2 bg-primary-200 text-white text-sm rounded-lg hover:bg-primary-300 disabled:bg-gray-300 disabled:cursor-not-allowed'
                          >
                            {submittingAnswer === item.reviewId
                              ? '등록 중...'
                              : '답변 등록하기'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination totalPage={pagination?.totalPage} />
        </div>

        {/* 이미지 모달 */}
        {isModalOpen && modalImage && (
          <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            onClick={handleModalBackgroundClick}
          >
            <div className='relative flex items-center justify-center gap-4 md:gap-8 max-w-full max-h-full'>
              {/* 이전 버튼 */}
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

                {/* 닫기 버튼 */}
                <button
                  onClick={closeImageModal}
                  className='absolute -top-8 -right-8 md:-top-12 md:-right-12 text-white text-lg md:text-2xl bg-black bg-opacity-70 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all z-10'
                >
                  ×
                </button>
              </div>

              {/* 다음 버튼 */}
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
    </InnerPaddingSectionWrapper>
  );
}
