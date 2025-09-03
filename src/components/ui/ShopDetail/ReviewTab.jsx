import { reviews } from '../../../data/Review';
import { useState } from 'react';

export default function ReviewTab() {
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
    <div className=''>
      <div className='bg-white rounded-lg'>
        <p className='text-xl text-start font-semibold text-gray-800'>
          리뷰 {reviews.length} 건
        </p>

        <div className=''>
          {reviews.map(review => (
            <div
              key={review.id}
              className='border-t border-gray-300 py-6 last:border-b-0'
            >
              <div className='flex items-center px-2'>
                <ul className='flex flex-col items-start text-lg gap-2'>
                  <li className='text-gray-500 font-medium'>{review.user}</li>
                  <li className='text-lg text-gray-500 font-montserrat w-full whitespace-nowrap'>
                    {review.date}
                  </li>
                </ul>
                <div className='flex flex-col items-start justify-start px-16 gap-1 w-full'>
                  <div className='flex items-center justify-start gap-1'>
                    <p>{renderStars(review.rating)}</p>
                    <span className='text-sm text-black-100 font-montserrat px-2'>
                      {review.rating}
                    </span>
                  </div>
                  <div className='text-gray-500 font-montserrat text-start'>
                    <p>
                      {expandedReviews[review.id]
                        ? review.content
                        : truncateText(review.content)}
                    </p>
                    {review.content.length > 20 && (
                      <button
                        onClick={() => toggleReviewExpansion(review.id)}
                        className='text-gray-500 hover:text-primary-200 text-sm mt-1'
                      >
                        {expandedReviews[review.id] ? '접기' : '더보기'}
                      </button>
                    )}
                  </div>
                  <div className='flex items-center justify-start gap-1'>
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={image}
                        className='max-w-[75px] max-h-[75px] object-cover'
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
