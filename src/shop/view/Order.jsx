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
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    const purchaseItems = JSON.parse(
      sessionStorage.getItem('purchaseItems') || '[]',
    );

    if (purchaseItems.length > 0) {
      setSelectedItems(purchaseItems);
    } else {
      const sessionCart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const checkedItems = sessionCart.filter(item => item.checked === true);
      setSelectedItems(checkedItems);
    }
  }, []);

  const handleFormValidChange = (isValid, customerData) => {
    console.log('폼 유효성 변경:', {
      isValid,
      customerData,
      hasName: !!customerData?.name,
      hasEmail: !!customerData?.email,
    });
    setIsFormValid(isValid);
    setCustomerInfo(customerData);
  };

  return (
    <InnerPaddingSectionWrapper className='max-w-[800px]'>
      <h2 className='text-4xl font-semibold font-pretendard pb-5'>주문/결제</h2>
      <BreadCrumbSection currentStep='order' />
      <OrderItemListSection selectedItems={selectedItems} />
      <AddressInfoSection onFormValidChange={handleFormValidChange} />
      <OrderSummarySection items={selectedItems} />
      <PaymentButton
        selectedItems={selectedItems}
        customerInfo={customerInfo}
        disabled={!isFormValid}
      />
    </InnerPaddingSectionWrapper>
  );
}
