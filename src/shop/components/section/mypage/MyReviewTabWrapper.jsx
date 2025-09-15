import MyReviewWriteTab from '../../ui/mypage/MyReviewWriteTab';
import CompletedReviewTab from '../../ui/mypage/CompletedReviewTab';

export default function MyReviewTabWrapper({ myreview }) {
  const renderTabContent = () => {
    switch (myreview) {
      case 'myReviewWrite':
        return <MyReviewWriteTab />;
      case 'completedReview':
        return <CompletedReviewTab />;

      default:
        return <MyReviewWriteTab />;
    }
  };

  return (
    <>
      <div>{renderTabContent()}</div>
    </>
  );
}
