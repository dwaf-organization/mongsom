import { Link } from 'react-router-dom';

import { orderList } from '../../../data/OrderList';
import { useModal } from '../../../context/ModalContext';
import DeliveryTrackingModal from '../DeliveryTrackingModal';

export default function OrderListTab() {
  const { openModal } = useModal();

  const handleOpenModal = orderId => {
    openModal(<DeliveryTrackingModal orderId={orderId} />);
  };

  return (
    <ul>
      {orderList.map(item => (
        <li key={item.id} className='border-b border-gray-400 py-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <p className='font-montserrat text-left font-semibold text-lg'>
                {item.orderDate}
              </p>
              <Link
                className='text-sm text-gray-50'
                to={`/order-detail/${item.id}`}
              >
                주문상세보기
              </Link>
            </div>

            <div className='flex items-start gap-4'>
              <img
                src={item.products[0].image}
                alt={item.products[0].name}
                className='w-[100px] h-[100px] object-cover rounded-lg'
              />

              <div className='flex-1'>
                <p className='text-left text-sm text-gray-500'>
                  주문번호 : 123456789
                </p>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-gray-900'>{item.products[0].name}</p>
                  {item.products.length > 1 && (
                    <span className='text-sm text-gray-500'>
                      외 {item.products.length - 1}개
                    </span>
                  )}
                </div>
                <p className='text-sm text-gray-600 mb-2 text-left'>
                  옵션: {item.products[0].option}
                </p>
                <div className='flex items-center gap-4 text-sm  '>
                  <span className='font-semibold'>
                    {item.totalAmount.toLocaleString()}원
                  </span>
                  <span>
                    수량:
                    {item.products.reduce(
                      (total, product) => total + product.quantity,
                      0,
                    )}
                    개
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <button
                  className='border border-gray-500 text-gray-50 rounded-lg px-6 py-1 mt-4 self-center'
                  onClick={() => handleOpenModal(item.id)}
                >
                  배송조회
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
