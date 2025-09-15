import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import AddNoticeSection from '../components/section/notice/AddNoticeSection';

export default function Notice() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>공지 등록</h2>
      <AddNoticeSection />
    </InnerPaddingSectionWrapper>
  );
}
