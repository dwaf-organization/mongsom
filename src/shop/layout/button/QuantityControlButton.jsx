'use client';
import Minus from '../../asset/icons/Minus';
import Plus from '../../asset/icons/Plus';

export default function QuantityControlButton({ value, setValue }) {
  const handleMinus = () => {
    if (value > 1) {
      setValue(value - 1);
    }
  };

  const handlePlus = () => {
    setValue(value + 1);
  };

  return (
    <div className='flex items-center justify-center '>
      <button
        onClick={handleMinus}
        className='w-8 h-8 bg-gray-200 rounded-l-lg flex items-center justify-center transition-colors duration-200'
        disabled={value <= 1}
      >
        <Minus />
      </button>
      <input
        type='text'
        value={value}
        readOnly
        className='w-14 h-8 text-center text-sm border border-gray-300  bg-white'
      />
      <button
        onClick={handlePlus}
        className='w-8 h-8 bg-gray-200  rounded-r-lg flex items-center justify-center transition-colors duration-200'
      >
        <Plus />
      </button>
    </div>
  );
}
