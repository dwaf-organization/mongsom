import { useParams } from 'react-router-dom';

import { orderList } from '../../../data/OrderList';

export default function ReviewProductInfo() {
  const { id } = useParams();
  const order = orderList.find(order => order.id === parseInt(id));
  return (
    <ul className='flex flex-col gap-4 pt-4'>
      {order.products.map(item => (
        <li key={item.id} className=' rounded-xl px-4 py-6 flex  gap-4'>
          <img
            src={item.image}
            alt={item.name}
            className='w-[200px] h-[200px] object-cover'
          />

          <div className='flex items-center gap-2 mb-1'>
            <p className='text-gray-900 font-semibold'>
              {item.name},{item.quantity}개
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
