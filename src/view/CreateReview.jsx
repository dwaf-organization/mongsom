import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ReviewProductInfo from '../components/ui/mypage/ReviewProductInfo';
import ReviewContents from '../components/ui/mypage/ReviewContents';
import PhotoReview from '../components/section/mypage/PhotoReview';
import ReviewButtons from '../components/ui/mypage/ReviewButtons';

export default function CreateReview() {
  return (
    <InnerPaddingSectionWrapper>
      <p className='text-2xl font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        리뷰 작성
      </p>
      <ReviewProductInfo />
      <ReviewContents />
      <PhotoReview />
      <ReviewButtons />
    </InnerPaddingSectionWrapper>
  );
}
