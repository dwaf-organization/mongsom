import ProductInfoTab from '../../ui/ShopDetail/ProductInfoTab';
import ReviewTab from '../../ui/ShopDetail/ReviewTab';
import ExchangeReturnTab from '../../ui/ShopDetail/ExchangeReturnTab';
import QnATab from '../../ui/ShopDetail/QnATab';

export default function ShopDetailInfoListSection({ tab, product, isLoading }) {
  console.log('🚀 ~ ShopDetailInfoListSection ~ isLoading:', isLoading);
  const renderTabContent = () => {
    switch (tab) {
      case 'info':
        return <ProductInfoTab product={product} isLoading={isLoading} />;
      case 'review':
        return <ReviewTab />;
      case 'exchange':
        return <ExchangeReturnTab />;
      case 'qna':
        return <QnATab />;
      default:
        return <ProductInfoTab />;
    }
  };

  return (
    <>
      <div>{renderTabContent()}</div>
    </>
  );
}
