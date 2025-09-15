import { reviews } from '../../../data/Review';
import { useState } from 'react';

export default function CompletedReviewTab() {
  const [expandedReviews, setExpandedReviews] = useState({});

  const renderStars = rating => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? 'text-primary-200' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  const toggleReviewExpansion = reviewId => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <section>
      <h2 className='text-xl text-start font-semibold text-gray-800 border-b border-black-100 pb-4 mt-8 px-4'>
        작성한 리뷰 {reviews.length}
      </h2>

      <ul>
        {reviews.map(review => (
          <li
            key={review.id}
            className='border-t border-gray-300 py-6 last:border-b-0'
          >
            <div className='flex items-center justify-between mb-2 border-b w-full border-gray-300 pb-4 '>
              <div className='flex items-center gap-4'>
                <img
                  src={review.images[0]}
                  alt={review.name}
                  className='w-[80px] h-[80px] object-cover'
                />
                <p>주방용품 선물세트6개입 세트</p>
              </div>
              <p className='text-primary-200'>수정 | 삭제</p>
            </div>
            <article className='px-2'>
              <header className='flex items-center gap-1 mb-2'>
                <div>{renderStars(review.rating)}</div>
                <time className='text-sm text-black-100 font-montserrat px-2'>
                  {review.date}
                </time>
              </header>

              <p className='text-gray-500 font-montserrat text-start'>
                {expandedReviews[review.id]
                  ? review.content
                  : truncateText(review.content)}
                {review.content.length > 20 && (
                  <button
                    onClick={() => toggleReviewExpansion(review.id)}
                    className='text-gray-500 hover:text-primary-200 text-sm mt-1 ml-2'
                  >
                    {expandedReviews[review.id] ? '접기' : '더보기'}
                  </button>
                )}
              </p>

              {review.images.length > 0 && (
                <figure className='flex items-center justify-start gap-1 mt-2'>
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className='max-w-[75px] max-h-[75px] object-cover'
                    />
                  ))}
                </figure>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
