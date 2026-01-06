import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getOrderDetail, exchangeOrder } from '../api/order';
import { Button } from '../components/ui/button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Exchange() {
  const { userCode } = useAuth();
  const { addToast } = useToast();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exchangeReason, setExchangeReason] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [exchangeType, setExchangeType] = useState('exchange');

  // ✅ 반품 전용 입력값
  const [refundBank, setRefundBank] = useState(''); // 은행명
  const [refundAccount, setRefundAccount] = useState(''); // 계좌번호(숫자만)
  const onlyDigits = v => (v || '').replace(/\D/g, '');

  useEffect(() => {
    let cancel = false;
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await getOrderDetail(orderId);
        const data = res.orderItems;
        const exchangeDeliveryStatus = res.orderInfo || '';
        // const data =
        //   res.orderItems &&
        //   typeof res === 'object' &&
        //   res.orderItems &&
        //   typeof res.orderItems === 'object'
        //     ? res.orderItems
        //     : res;
        if (!cancel) {
          setOrder(data || null);
          setDeliveryStatus(exchangeDeliveryStatus);
        }
      } catch (e) {
        console.error('주문 상세 조회 실패:', e);
        if (!cancel) {
          setOrder(null);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [orderId]);

  console.log('🚀 ~ Exchange ~ order1234:', order);

  // const allProducts = useMemo(() => {
  //   if (!order) return [];
  //   const details = Array.isArray(order.details) ? order.details : [];
  //   return details.map(d => {
  //     const firstImg = Array.isArray(d.productImgUrls)
  //       ? d.productImgUrls.find(
  //           u => typeof u === 'string' && u.startsWith('http'),
  //         ) || ''
  //       : '';
  //     return {
  //       id:
  //         d.orderDetailId ??
  //         d.id ??
  //         `${order.orderId ?? order.id}-${d.productId ?? 'p'}`,
  //       orderDetailId: d.orderDetailId ?? d.id ?? null,
  //       image: firstImg,
  //       name: d.productName ?? d.name ?? '',
  //       option: d.optName ?? d.option ?? '',
  //       quantity: d.quantity ?? 1,
  //       totalPrice:
  //         typeof d.price === 'number' ? d.price : (order.finalPrice ?? 0),
  //       changeStatus: d.changeStatus ?? null,
  //       orderId: order.orderId ?? order.id,
  //       orderNumber: order.orderNumber ?? order.orderId,
  //       orderDate: order.paymentAt ?? order.orderDate,
  //       orderStatus: order.deliveryStatus ?? order.status,
  //     };
  //   });
  // }, [order]);

  const handleProductSelect = productId => {
    console.log('🚀 ~ handleProductSelect called with:', productId);
    const target = order.find(p => p.orderDetailId === productId);
    console.log('🚀 ~ handleProductSelect ~ target:', target);
    if (!target) return;
    const isDisabled = target.changeStatus !== null;
    console.log('🚀 ~ Exchange ~ target.changeStatus:', target.changeStatus);
    console.log('🚀 ~ Exchange ~ isDisabled:', isDisabled);
    if (isDisabled) return;
    setSelectedProduct(productId);
    console.log('🚀 ~ selectedProduct set to:', productId);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) {
      addToast('교환/반품할 상품을 선택해주세요.');
      return;
    }
    if (!exchangeReason.trim()) {
      addToast('교환/반품 사유를 입력해주세요.');
      return;
    }

    // ✅ 반품일 때 은행/계좌 필수
    if (exchangeType === 'return') {
      if (!refundBank.trim()) {
        addToast('환불 은행을 입력해주세요.');
        return;
      }
      if (!refundAccount.trim()) {
        addToast('환불 계좌번호를 입력해주세요.');
        return;
      }
    }

    const target = order.find(p => p.orderDetailId === selectedProduct);
    if (!target) {
      addToast('선택한 상품 정보를 찾을 수 없습니다.');
      return;
    }
    if (target.changeStatus != null) {
      addToast('이미 교환/반품이 진행 중인 상품입니다.');
      return;
    }

    // ✅ contents 조합: 사유 + (반품이면) 은행/계좌 문구 추가
    const reason =
      exchangeType === 'return'
        ? `${exchangeReason.trim()}\n[환불 계좌]\n- 은행: ${refundBank.trim()}\n- 계좌: ${refundAccount.trim()}`
        : exchangeReason.trim();

    const payloadBase = {
      orderDetailId: target.orderDetailId ?? selectedProduct,
      reason,
      userCode,
    };

    try {
      if (exchangeType === 'exchange') {
        const payload = {
          ...payloadBase,
          changeType: '교환',
          refundBanck: null,
          refundAccount: null,
        };
        const res = await exchangeOrder(payload);
        console.log('🚀 ~ handleSubmit ~ res:', res);
        if (res?.code === 1) {
          addToast('교환 신청이 완료되었습니다.');
          navigate(-1);
          return;
        }
      } else {
        const payload = {
          ...payloadBase,
          changeType: '반품',
          refundBanck: refundBank.trim(),
          refundAccount: refundAccount.trim(),
        };
        const res = await exchangeOrder(payload);
        if (res?.code === 1) {
          addToast('반품 신청이 완료되었습니다.');
          navigate(-1);
          return;
        }
      }
      addToast('요청 처리 중 문제가 발생했습니다.');
    } catch (e) {
      console.error('교환/반품 신청 실패:', e);
      addToast('요청 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-600'>
        불러오는 중…
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-sm md:text-2xl font-bold mb-4'>
            교환, 반품 신청
          </h2>
          <p className='text-gray-600'>주문 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(-1)} className='mt-4'>
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen md:py-8'>
      <div className='md:max-w-4xl md:mx-auto md:px-4'>
        <div className='p-6'>
          <h2 className='md:text-2xl font-bold text-center mb-6'>
            교환, 반품 신청
          </h2>

          <div className='space-y-2 max-h-96 overflow-y-auto mb-6'>
            {order.map(product => {
              const isDisabled = product.changeStatus !== null;
              console.log(
                '🚀 ~ Exchange ~ product.changeStatus:',
                product.changeStatus,
              );
              console.log('🚀 ~ Exchange ~ isDisabled:', isDisabled);
              return (
                <div
                  key={`${product.orderId}-${product.orderDetailId}`}
                  className={`flex items-center gap-4 md:p-4 cursor-pointer transition-colors rounded-lg ${
                    isDisabled
                      ? 'opacity-60 cursor-not-allowed bg-gray-300'
                      : ''
                  }`}
                  onClick={() => {
                    console.log(
                      '🚀 ~ onClick triggered for:',
                      product.orderDetailId,
                    );
                    console.log('🚀 ~ onClick isDisabled:', isDisabled);
                    if (!isDisabled) {
                      handleProductSelect(product.orderDetailId);
                    }
                  }}
                  aria-disabled={isDisabled}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedProduct === product.orderDetailId
                        ? 'bg-primary-200 border-primary-200'
                        : 'border-gray-300'
                    } ${isDisabled ? 'opacity-50' : ''}`}
                  >
                    {selectedProduct === product.orderDetailId && (
                      <div className='w-2 h-2 bg-white rounded-full' />
                    )}
                  </div>

                  <img
                    src={product.productImgUrl}
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded-lg'
                  />

                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold md:text-lg truncate max-w-[100px]'>
                        {product.name}
                      </h3>
                      {isDisabled && (
                        <span className='text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700'>
                          진행중
                        </span>
                      )}
                    </div>
                    <p className='text-gray-600 text-sm mb-1 truncate max-w-[150px]'>
                      옵션: {product.option1Name} / {product.option2Name}
                    </p>
                    <p className='text-gray-600 text-sm mb-1'>
                      수량: {product.quantity}개
                    </p>
                  </div>

                  <div className='text-right'>
                    <p className='font-semibold text-lg'>
                      {Number(product.lineTotalPrice ?? 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='flex gap-4 mb-6'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='exchangeType'
                value='exchange'
                checked={exchangeType === 'exchange'}
                onChange={e => setExchangeType(e.target.value)}
                className='w-4 h-4'
              />
              <span>교환</span>
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                name='exchangeType'
                value='return'
                checked={exchangeType === 'return'}
                onChange={e => setExchangeType(e.target.value)}
                className='w-4 h-4'
              />
              <span>반품</span>
            </label>
          </div>

          <div className='space-y-2 mb-6'>
            <label className='block font-semibold'>
              {exchangeType === 'exchange' ? '교환' : '반품'} 사유
            </label>
            <textarea
              value={exchangeReason}
              onChange={e => setExchangeReason(e.target.value)}
              placeholder={`${exchangeType === 'exchange' ? '교환' : '반품'} 사유를 입력해주세요.`}
              className='w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none'
            />

            {/* ✅ 반품일 때만 은행/계좌 입력 노출 */}
            {exchangeType === 'return' && (
              <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    환불 은행
                  </label>
                  <input
                    type='text'
                    value={refundBank}
                    onChange={e => setRefundBank(e.target.value)}
                    placeholder='예: 국민은행'
                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-primary-200'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium'>
                    환불 계좌번호
                  </label>
                  <input
                    type='text'
                    inputMode='numeric'
                    value={refundAccount}
                    onChange={e => setRefundAccount(onlyDigits(e.target.value))}
                    placeholder='숫자만 입력'
                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-primary-200'
                  />
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-4 justify-end'>
            <Button
              variant='outline'
              onClick={() => {
                setSelectedProduct(null);
                setExchangeReason('');
                setRefundBank('');
                setRefundAccount('');
                navigate(-1);
              }}
              className='py-2'
            >
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {exchangeType === 'exchange' ? '교환' : '반품'} 신청
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
