import { useState } from 'react';
import { Button } from '../button';
import {
  openPaymentWidget,
  createPaymentData,
} from '../../../utils/tossPayments';

export default function PaymentButton({
  selectedItems,
  customerInfo,
  disabled = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (disabled || !selectedItems || selectedItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }

    console.log('고객 정보 검증:', {
      customerInfo,
      hasName: !!customerInfo?.name,
      hasEmail: !!customerInfo?.email,
      name: customerInfo?.name,
      email: customerInfo?.email,
    });

    if (!customerInfo || !customerInfo.name) {
      alert('고객 정보를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('결제 시작 - 선택된 상품:', selectedItems);
      console.log('고객 정보:', customerInfo);

      const paymentData = createPaymentData(selectedItems, customerInfo);
      console.log('생성된 결제 데이터:', paymentData);

      await openPaymentWidget(paymentData);
    } catch (error) {
      console.error('결제 실패:', error);
      console.error('오류 상세:', error.message);
      console.error('오류 스택:', error.stack);

      let errorMessage = '결제 요청에 실패했습니다.';

      if (error.message) {
        errorMessage += `\n오류: ${error.message}`;
      }

      if (error.code) {
        errorMessage += `\n오류 코드: ${error.code}`;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center'>
      <Button
        className='w-fit px-10 py-2 mt-10 font-bold text-xl font-pretendard bg-black-100 text-white hover:bg-black-100/90 disabled:bg-gray-400 disabled:cursor-not-allowed'
        onClick={handlePayment}
        disabled={disabled || isLoading}
      >
        {isLoading ? '결제 처리 중...' : '결제하기'}
      </Button>
    </div>
  );
}
