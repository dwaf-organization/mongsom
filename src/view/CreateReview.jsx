import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ReviewProductInfo from '../components/ui/mypage/ReviewProductInfo';

export default function CreateReview() {
  return (
    <InnerPaddingSectionWrapper>
      <p className='text-xl font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        리뷰 작성
      </p>
      <ReviewProductInfo />
    </InnerPaddingSectionWrapper>
  );
}
