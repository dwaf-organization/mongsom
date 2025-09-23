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
  const [exchangeType, setExchangeType] = useState('exchange');

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
        const data =
          res &&
          typeof res === 'object' &&
          res.data &&
          typeof res.data === 'object'
            ? res.data
            : res;
        if (!cancel) setOrder(data || null);
      } catch (e) {
        console.error('주문 상세 조회 실패:', e);
        if (!cancel) setOrder(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [orderId]);

  const allProducts = useMemo(() => {
    if (!order) return [];
    const details = Array.isArray(order.details) ? order.details : [];
    return details.map(d => {
      const firstImg = Array.isArray(d.productImgUrls)
        ? d.productImgUrls.find(
            u => typeof u === 'string' && u.startsWith('http'),
          ) || ''
        : '';
      return {
        id:
          d.orderDetailId ??
          d.id ??
          `${order.orderId ?? order.id}-${d.productId ?? 'p'}`,
        orderDetailId: d.orderDetailId ?? d.id ?? null,
        image: firstImg,
        name: d.productName ?? d.name ?? '',
        option: d.optName ?? d.option ?? '',
        quantity: d.quantity ?? 1,
        totalPrice:
          typeof d.price === 'number' ? d.price : (order.finalPrice ?? 0),

        // 진행 상태
        changeStatus: d.changeStatus ?? null,

        // 주문 공통
        orderId: order.orderId ?? order.id,
        orderNumber: order.orderNumber ?? order.orderId,
        orderDate: order.paymentAt ?? order.orderDate,
        orderStatus: order.deliveryStatus ?? order.status,
      };
    });
  }, [order]);

  const handleProductSelect = productId => {
    const target = allProducts.find(p => p.id === productId);
    if (!target) return;
    const isDisabled = target.changeStatus != null; // 진행 중이면 선택 불가
    if (isDisabled) return;
    setSelectedProduct(productId);
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

    const target = allProducts.find(p => p.id === selectedProduct);
    if (!target) {
      addToast('선택한 상품 정보를 찾을 수 없습니다.');
      return;
    }
    if (target.changeStatus != null) {
      addToast('이미 교환/반품이 진행 중인 상품입니다.');
      return;
    }

    const payloadBase = {
      orderDetailId: target.orderDetailId ?? selectedProduct,
      orderId,
      contents: exchangeReason,
      userCode,
    };

    try {
      if (exchangeType === 'exchange') {
        const payload = { ...payloadBase, changeStatus: 1 };
        const res = await exchangeOrder(payload);
        if (res?.code === 1) {
          addToast('교환 신청이 완료되었습니다.');
          navigate(-1);
          return;
        }
      } else {
        const payload = { ...payloadBase, changeStatus: 2 };
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
          <h2 className='text-2xl font-bold mb-4'>교환, 반품 신청</h2>
          <p className='text-gray-600'>주문 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(-1)} className='mt-4'>
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            교환, 반품 신청
          </h2>

          <div className='space-y-2 max-h-96 overflow-y-auto mb-6'>
            {allProducts.map(product => {
              const isDisabled = product.changeStatus != null;

              return (
                <div
                  key={`${product.orderId}-${product.id}`}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-colors rounded-lg
                    ${isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-300' : ''}`}
                  onClick={() => handleProductSelect(product.id)}
                  aria-disabled={isDisabled}
                >
                  {/* 라디오(선택용 원) */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedProduct === product.id ? 'bg-primary-200 border-primary-200' : 'border-gray-300'}
                      ${isDisabled ? 'opacity-50' : ''}`}
                  >
                    {selectedProduct === product.id && (
                      <div className='w-2 h-2 bg-white rounded-full' />
                    )}
                  </div>

                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded-lg'
                  />

                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold text-lg'>{product.name}</h3>
                      {isDisabled && (
                        <span className='text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700'>
                          진행중
                        </span>
                      )}
                    </div>
                    <p className='text-gray-600 text-sm mb-1'>
                      옵션: {product.option}
                    </p>
                    <p className='text-gray-600 text-sm mb-1'>
                      수량: {product.quantity}개
                    </p>
                    <p className='text-gray-600 text-sm'>
                      상태: {product.orderStatus}
                    </p>
                  </div>

                  <div className='text-right'>
                    <p className='font-semibold text-lg'>
                      {Number(product.totalPrice ?? 0).toLocaleString()}원
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
          </div>

          <div className='flex gap-4 justify-end'>
            <Button
              variant='outline'
              onClick={() => {
                setSelectedProduct(null);
                setExchangeReason('');
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
