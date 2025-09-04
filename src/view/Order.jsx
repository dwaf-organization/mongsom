import { useState, useEffect } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/cart/BreadCrumbSection';
import OrderItemListSection from '../components/section/order/OrderItemListSection';
import AddressInfoSection from '../components/section/order/AddressInfoSection';
import OrderSummarySection from '../components/section/order/OrderSummarySection';
import PaymentButton from '../components/ui/order/PaymentButton';

export default function Order() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const sessionCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const checkedItems = sessionCart.filter(item => item.checked === true);
    setSelectedItems(checkedItems);
  }, []);

  const handleFormValidChange = isValid => {
    setIsFormValid(isValid);
  };

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-4xl font-semibold font-pretendard pb-5'>주문/결제</h2>
      <BreadCrumbSection currentStep='order' />
      <OrderItemListSection selectedItems={selectedItems} />
      <AddressInfoSection onFormValidChange={handleFormValidChange} />
      <OrderSummarySection items={selectedItems} />
      <PaymentButton disabled={!isFormValid} />
    </InnerPaddingSectionWrapper>
  );
}
