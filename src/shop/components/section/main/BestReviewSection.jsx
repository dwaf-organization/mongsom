import InnerPaddingSectionWrapper from '../../../wrapper/InnerPaddingSectionWrapper';
import { bestReview } from '../../../data/BestReview';

export default function BestReviewSection() {
  return (
    <InnerPaddingSectionWrapper className='py-20'>
      <div>
        <h2 className='text-start text-4xl font-bold text-primary-200 font-montserrat mb-4'>
          Best Review
        </h2>
        <p className='text-start text-primary-200 text-lg mb-12'>
          사랑하는 사람에게 소중한 선물을 해보세요.
        </p>
      </div>

      <ul className=' md:grid-cols-2 lg:grid-cols-3 mb-10'>
        <li className='grid grid-cols-3 gap-6'>
          {bestReview.map(review => (
            <div key={review.id}>
              <img src={review.image} alt={review.title} />
              <p className='text-start font-pretendard font-semibold'>
                {review.title}
              </p>
              <p className='text-start text-secondary-200 font-pretendard'>
                {review.description}
              </p>
            </div>
          ))}
        </li>
      </ul>
    </InnerPaddingSectionWrapper>
  );
}
