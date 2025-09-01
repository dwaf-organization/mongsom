import { useState } from 'react';
import CheckBox from '../../ui/CheckBox';
import { cart as cartData } from '../../../data/Cart';

export default function CartItemListSection() {
  const [cart, setCart] = useState(cartData);

  const handleIncrease = id => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, count: item.count + 1 } : item,
    );
    setCart(updatedCart);
  };

  const handleDecrease = id => {
    const updatedCart = cart.map(item =>
      item.id === id && item.count > 1
        ? { ...item, count: item.count - 1 }
        : item,
    );
    setCart(updatedCart);
  };

  const calculateTotalPrice = item => {
    return item.price * item.count;
  };

  return (
    <ul className='flexs flex-col items-start justify-start gap-4 w-full'>
      {cart.map(item => (
        <li
          key={item.id}
          className='flex items-start justify-start gap-4 border-t border-gray-500 py-10'
        >
          <img
            src={item.image}
            alt={item.name}
            className='max-w-[200px] max-h-[200px] object-cover rounded-lg'
          />
          <div className='flex flex-col items-start gap-2 px-6 w-full'>
            <div className='flex justify-between gap-2 w-full'>
              <p className='text-xl font-semibold whitespace-nowrap'>
                {item.name}
              </p>
              <CheckBox />
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-pretendart border-r border-gray-500 pr-2 text-gray-500 leading-none'>
                옵션
              </p>
              <p className='text-pretendart text-gray-600'>{item.option}</p>
            </div>
            <p className='text-pretendart font-semibold text-xl'>
              {calculateTotalPrice(item).toLocaleString()}원
            </p>
            <div className='flex items-center gap-2'>
              <p className='text-pretendart pr-3'>수량</p>
              <button
                onClick={() => handleDecrease(item.id)}
                className='text-2xl text-gray-600'
              >
                -
              </button>
              <span className='text-pretendart min-w-[40px] text-center'>
                {item.count}
              </span>
              <button
                onClick={() => handleIncrease(item.id)}
                className='text-xl text-gray-600'
              >
                +
              </button>
            </div>
          </div>
        </li>
      ))}
      <div className='flex items-center justify-end border-t border-gray-500 py-4 '>
        <button className='text-pretendart text-gray-500 border border-gray-400 px-4 py-2 rounded-lg '>
          선택 상품 삭제
        </button>
      </div>
    </ul>
  );
}
