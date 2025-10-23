import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import EditNoticeSection from '../components/section/notice/EditNoticeSection';

export default function NoticeList() {
  return (
    <InnerPaddingSectionWrapper>
      <h2>공지수정</h2>
      <EditNoticeSection />
    </InnerPaddingSectionWrapper>
  );
}
