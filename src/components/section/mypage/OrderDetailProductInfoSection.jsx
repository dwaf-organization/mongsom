import { useParams } from 'react-router-dom';

import { orderList } from '../../../data/OrderList';
import ProductActionButtons from '../../ui/mypage/ProductActionButtons';

export default function OrderDetailProductInfoSection() {
  const { id } = useParams();
  const order = orderList.find(order => order.id === parseInt(id));
  return (
    <ul className='flex flex-col gap-4 pt-4'>
      {order.products.map(item => (
        <li
          key={item.id}
          className='border border-gray-400 rounded-xl px-4 py-6 flex items-start justify-between'
        >
          <div className='flex flex-col gap-4'>
            <p className='text-gray-500 text-left'>
              주문번호 : 020202020202020
            </p>

            <div className='flex items-start gap-4'>
              <img
                src={item.image}
                alt={item.name}
                className='w-[80px] h-[80px] object-cover rounded-lg'
              />

              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <p className='text-gray-900'>{item.name}</p>
                </div>
                <p className='text-sm text-gray-600 mb-2 text-left'>
                  옵션: {item.option}
                </p>
                <div className='flex items-center gap-4 text-sm'>
                  <span className='font-semibold'>
                    {item.price.toLocaleString()}원
                  </span>
                  <span>수량: {item.quantity}개</span>
                </div>
              </div>
            </div>
          </div>
          <ProductActionButtons />
        </li>
      ))}
    </ul>
  );
}
