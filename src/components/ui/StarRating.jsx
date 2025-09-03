import { useState } from 'react';

export default function StarRating({
  rating = 0,
  onRatingChange,
  readOnly = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = starRating => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = starRating => {
    if (!readOnly) {
      setHoverRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }, (_, index) => {
        const starRating = index + 1;
        const isActive = starRating <= (hoverRating || rating);

        return (
          <button
            key={index}
            type='button'
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => handleStarHover(starRating)}
            onMouseLeave={handleStarLeave}
            disabled={readOnly}
            className={`
              text-2xl transition-colors duration-200
              ${isActive ? 'text-yellow-400' : 'text-gray-300'}
              ${!readOnly ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}
            `}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
