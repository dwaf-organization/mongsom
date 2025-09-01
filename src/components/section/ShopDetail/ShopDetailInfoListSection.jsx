import ProductInfoTab from '../../ui/ShopDetail/ProductInfoTab';
import ReviewTab from '../../ui/ShopDetail/ReviewTab';
import ExchangeReturnTab from '../../ui/ShopDetail/ExchangeReturnTab';

export default function ShopDetailInfoListSection({ tab, productId }) {
  const renderTabContent = () => {
    switch (tab) {
      case 'info':
        return <ProductInfoTab productId={productId} />;
      case 'review':
        return <ReviewTab />;
      case 'exchange':
        return <ExchangeReturnTab />;
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
