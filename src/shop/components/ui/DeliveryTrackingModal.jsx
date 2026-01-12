import { getOrderDeliveryInfo } from '../../api/order';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';

export default function DeliveryTrackingModal({ orderId }) {
  console.log('🚀 ~ DeliveryTrackingModal ~ orderId:', orderId);
  const { addToast } = useToast();
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // API 키 이름이 다를 수도 있으니 정규화
  const normalized = useMemo(() => {
    if (!deliveryInfo) return null;
    return {
      invoiceNumber:
        deliveryInfo.invoiceNumber ??
        deliveryInfo.invoiceNum ??
        deliveryInfo.trackingNumber ??
        '',
      deliveryCom: deliveryInfo.deliveryCom ?? deliveryInfo.courier ?? '',
      ...deliveryInfo,
    };
  }, [deliveryInfo]);

  useEffect(() => {
    if (!orderId) return;
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getOrderDeliveryInfo(orderId);
        // console.log('res:', res);

        if (!ignore) {
          if (res?.code === -2) {
            addToast('요청 중 오류가 발생했습니다.', 'error');
            setDeliveryInfo(null);
          } else {
            setDeliveryInfo(res?.data ?? res); // 백엔드 응답 형태에 맞춰 조정
          }
        }
      } catch (e) {
        if (!ignore) {
          addToast('네트워크 오류로 배송 정보를 불러오지 못했습니다.', 'error');
          setDeliveryInfo(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [orderId, addToast]);

  if (loading) {
    return (
      <div className='text-center py-8 px-10'>
        <p className='text-sm text-gray-500'>배송 정보를 불러오는 중…</p>
      </div>
    );
  }

  const hasTrackingNumber =
    normalized?.invoiceNumber && normalized.invoiceNumber !== '';

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

      <div className='bg-blue-50 p-4 rounded-lg'>
        <h3 className='font-semibold text-lg mb-3'>송장번호</h3>
        <div className='space-y-2'>
          <p className='font-montserrat bg-white p-3 rounded border'>
            {normalized.invoiceNumber}
          </p>
          <p className='text-sm text-gray-600'>
            위 송장번호로 택배사에서 배송 조회가 가능합니다.
          </p>
          <div className='flex gap-2 mt-3'>
            <p>택배사</p>
            <p>{normalized.deliveryCom || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
