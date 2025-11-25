import InnerPaddingSectionWrapper from '../../../wrapper/InnerPaddingSectionWrapper';
import { bestReview } from '../../../data/BestReview';

export default function BestReviewSection() {
  return (
    <InnerPaddingSectionWrapper className='md:py-20'>
      <div>
        <h2 className='text-center text-2xl md:text-4xl font-bold text-primary-200 font-montserrat md:mb-4'>
          Best Review
        </h2>
      </div>

      <ul className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1 md:gap-6 md:mb-10 mt-6'>
        {bestReview.map(review => (
          <li key={review.id} className='flex flex-col gap-2'>
            <div className='relative group overflow-hidden rounded-xl'>
              <img
                src={review.image}
                alt={review.title}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 brightness-[0.5] md:brightness-100 md:group-hover:brightness-50'
              />

              <div
                className='
                  absolute inset-0
                  bg-black/0
                  group-hover:bg-black/60
                  hover:brightness-50
                  transition-all duration-300
                '
              />

              <div
                className='
    absolute inset-0 flex items-center justify-center px-4 text-center
    opacity-100 md:opacity-0
    md:group-hover:opacity-100
    transition-opacity duration-300 z-20
  '
              >
                <p className='text-white text-xs md:text-sm leading-relaxed line-clamp-6 md:line-clamp-none'>
                  {review.review}
                </p>
              </div>
            </div>

            <div className='mt-1'>
              <p className='text-start font-pretendard font-semibold text-xs md:text-base'>
                {review.title}
              </p>
              <p className='text-start text-secondary-200 font-pretendard text-xs md:text-base'>
                {review.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </InnerPaddingSectionWrapper>
  );
}
