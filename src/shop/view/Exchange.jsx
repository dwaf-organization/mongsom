import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderList } from '../data/OrderList';
import { Button } from '../components/ui/button';
import { useToast } from '../context/ToastContext';

export default function Exchange() {
  const { addToast } = useToast();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exchangeReason, setExchangeReason] = useState('');
  const [exchangeType, setExchangeType] = useState('exchange');

  const order = orderList.find(order => order.id === parseInt(orderId));
  console.log('Found order:', order);

  const allProducts = order
    ? order.products.map(product => ({
        ...product,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        orderStatus: order.status,
      }))
    : [];

  const handleProductSelect = productId => {
    setSelectedProduct(productId);
  };

  const handleSubmit = () => {
    if (!selectedProduct) {
      addToast('교환/반품할 상품을 선택해주세요.');
      return;
    }
    if (!exchangeReason.trim()) {
      addToast('교환/반품 사유를 입력해주세요.');
      return;
    }
    addToast('교환/반품 신청이 완료되었습니다.');
    navigate(-1);
  };

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
            {allProducts.map(product => (
              <div
                key={`${product.orderId}-${product.id}`}
                className={`flex items-center gap-4 p-4 cursor-pointer transition-colors`}
                onClick={() => handleProductSelect(product.id)}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedProduct === product.id
                      ? 'bg-primary-200 border-primary-200'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedProduct === product.id && (
                    <div className='w-2 h-2 bg-white rounded-full'></div>
                  )}
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className='w-16 h-16 object-cover rounded-lg'
                />

                <div className='flex-1'>
                  <h3 className='font-semibold text-lg mb-1'>{product.name}</h3>
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
                    {product.totalPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
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
