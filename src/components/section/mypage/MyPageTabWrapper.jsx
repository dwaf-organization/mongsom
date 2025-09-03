import MyInfoTab from '../../ui/mypage/MyInfoTab';
import MyReviewManagementTab from '../../ui/mypage/MyReviewManagementTab';
import MypageMain from './MypageMain';
import OrderListTab from '../../ui/mypage/OrderListTab';

export default function MyPageTabWrapper({ tab, productId, activeMyreview }) {
  const renderTabContent = () => {
    switch (tab) {
      case 'myInfo':
        return <MyInfoTab productId={productId} />;
      case 'orderList':
        return <OrderListTab />;
      case 'myReview':
        return <MyReviewManagementTab activeMyreview={activeMyreview} />;
      default:
        return <MypageMain />;
    }
  };

  return (
    <>
      <div>{renderTabContent()}</div>
    </>
  );
}
