import { useState, useEffect } from 'react';
import Select from '../Select';
import QuantityControlButton from '../../../layout/button/QuantityControlButton';

export default function OptionSelector({ product, onTotalPriceChange }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const totalPrice = selectedOptions.reduce((total, option) => {
      return total + product.price * option.quantity;
    }, 0);

    onTotalPriceChange(totalPrice);
  }, [selectedOptions, product.price, onTotalPriceChange]);

  const handleOptionChange = value => {
    const existingOptionIndex = selectedOptions.findIndex(
      option => option.name === value,
    );

    if (existingOptionIndex !== -1) {
      const updatedOptions = [...selectedOptions];
      updatedOptions[existingOptionIndex].quantity += 1;
      setSelectedOptions(updatedOptions);
    } else {
      setSelectedOptions([...selectedOptions, { name: value, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (optionName, newQuantity) => {
    const updatedOptions = selectedOptions.map(option =>
      option.name === optionName
        ? { ...option, quantity: newQuantity }
        : option,
    );
    setSelectedOptions(updatedOptions);
  };

  const removeOption = optionName => {
    setSelectedOptions(
      selectedOptions.filter(option => option.name !== optionName),
    );
  };

  return (
    <div className='flex flex-col gap-4 border-b border-gray-500 pb-4'>
      <Select
        options={product.option.map(option => ({
          label: option,
          value: option,
        }))}
        value=''
        onChange={handleOptionChange}
        className='w-full pb-4 items-center mt-4 border-b border-gray-500'
      />

      {selectedOptions.length > 0 && (
        <ul className='flex flex-col gap-3'>
          {selectedOptions.map((option, index) => (
            <li key={index} className='text-start w-full'>
              <div className='flex items-center w-full'>
                <span className='text-gray-900 font-semibold'>
                  {option.name}
                </span>
                <button
                  onClick={() => removeOption(option.name)}
                  className='hover:text-red-700 text-sm px-2 py-1 rounded'
                >
                  ✕
                </button>
              </div>

              <div className='flex justify-between items-center w-full mt-2'>
                <QuantityControlButton
                  value={option.quantity}
                  setValue={newQuantity =>
                    handleQuantityChange(option.name, newQuantity)
                  }
                />

                <span className='text-gray-900 font-semibold'>
                  {(product.price * option.quantity).toLocaleString()}원
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
