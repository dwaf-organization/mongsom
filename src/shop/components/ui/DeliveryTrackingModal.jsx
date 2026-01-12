import { getOrderDeliveryInfo } from '../../api/order';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { Package, Truck, Copy, Check, ExternalLink } from 'lucide-react';

export default function DeliveryTrackingModal({ orderId }) {
  const { addToast } = useToast();
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

        if (!ignore) {
          if (res?.code === -2) {
            addToast('요청 중 오류가 발생했습니다.', 'error');
            setDeliveryInfo(null);
          } else {
            setDeliveryInfo(res?.data ?? res);
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

  const handleCopy = async () => {
    if (!normalized?.invoiceNumber) return;
    try {
      await navigator.clipboard.writeText(normalized.invoiceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('복사에 실패했습니다.', 'error');
    }
  };

  const handleTrackingLink = () => {
    if (!normalized?.invoiceNumber) return;
    const url = `https://www.ilogen.com/web/personal/trace/${normalized.invoiceNumber}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-10'>
        <div className='w-10 h-10 border-3 border-primary-200 border-t-transparent rounded-full animate-spin mb-4' />
        <p className='text-sm text-gray-500'>배송 정보를 불러오는 중...</p>
      </div>
    );
  }

  const hasTrackingNumber =
    normalized?.invoiceNumber && normalized.invoiceNumber !== '';

  if (!hasTrackingNumber) {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-8'>
        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5'>
          <Package className='w-10 h-10 text-gray-400' />
        </div>
        <p className='text-lg font-medium text-gray-700 mb-2'>
          배송 정보가 없습니다
        </p>
        <p className='text-sm text-gray-500 text-center leading-relaxed'>
          아직 배송이 시작되지 않았거나
          <br />
          송장번호가 발급되지 않았습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-center gap-2 mb-6'>
        <Truck className='w-6 h-6 text-primary-200' />
        <h2 className='text-xl font-bold text-gray-800'>배송 조회</h2>
      </div>

      <div className='bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-5 mb-4'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm'>
            <Package className='w-4 h-4 text-primary-200' />
          </div>
          <span className='text-sm font-medium text-gray-600'>택배사</span>
          <span className='ml-auto text-sm font-semibold text-gray-800'>
            {normalized.deliveryCom || '로젠택배'}
          </span>
        </div>

        <div className='bg-white rounded-xl p-4 shadow-sm'>
          <p className='text-xs text-gray-500 mb-2'>송장번호</p>
          <div className='flex items-center justify-between gap-3'>
            <p className='font-mono text-lg font-semibold text-gray-800 tracking-wide'>
              {normalized.invoiceNumber}
            </p>
            <button
              onClick={handleCopy}
              className='flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm'
            >
              {copied ? (
                <>
                  <Check className='w-4 h-4 text-green-500' />
                  <span className='text-green-600'>복사됨</span>
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4 text-gray-500' />
                  <span className='text-gray-600'>복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleTrackingLink}
        className='w-full flex items-center justify-center gap-2 bg-primary-200 hover:bg-primary-300 text-white font-medium py-3 px-4 rounded-xl transition-colors'
      >
        <ExternalLink className='w-4 h-4' />
        택배사에서 배송 조회하기
      </button>

      <p className='text-xs text-gray-400 text-center mt-4'>
        버튼을 클릭하면 로젠택배 배송조회 페이지로 이동합니다
      </p>
    </div>
  );
}
