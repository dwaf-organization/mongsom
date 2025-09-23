import { getOrderDeliveryInfo } from '../../api/order';
import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function DeliveryTrackingModal({ orderId }) {
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const deliveryInfo = getOrderDeliveryInfo(orderId);
    if (deliveryInfo.code === -2) {
      addToast('요청중 에러가 발생했습니다.', 'error');
    }
    setDeliveryInfo(deliveryInfo);
  }, [orderId]);

  const hasTrackingNumber =
    deliveryInfo?.invoiceNumber && deliveryInfo.invoiceNumber !== '';

  if (!hasTrackingNumber) {
    return (
      <div className='text-center py-8 px-10'>
        <div className='text-6xl mb-4'>📦</div>
        <p className='text-lg text-gray-600 mb-2'>
          조회 가능한 배송 정보가 없습니다
        </p>
        <p className='text-sm text-gray-500'>
          아직 배송이 시작되지 않았거나 송장번호가 발급되지 않았습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold text-center mb-6'>배송 조회</h2>

      {/* 송장번호 정보 */}
      <div className='bg-blue-50 p-4 rounded-lg'>
        <h3 className='font-semibold text-lg mb-3'>송장번호</h3>
        {hasTrackingNumber ? (
          <div className='space-y-2'>
            <p className='font-montserrat bg-white p-3 rounded border'>
              {deliveryInfo.invoiceNumber}
            </p>
            <p className='text-sm text-gray-600'>
              위 송장번호로 택배사에서 배송 조회가 가능합니다.
            </p>
            <div className='flex gap-2 mt-3'>
              <p>택배사</p>
              <p>{deliveryInfo.deliveryCom}</p>
            </div>
          </div>
        ) : (
          <div className='text-center py-8'>
            <div className='text-6xl mb-4'>📦</div>
            <p className='text-lg text-gray-600 mb-2'>
              조회 가능한 배송 정보가 없습니다
            </p>
            <p className='text-sm text-gray-500'>
              아직 배송이 시작되지 않았거나 송장번호가 발급되지 않았습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
