import { useEffect, useMemo, useState } from 'react';
import Select from '../Select';
import QuantityControlButton from '../../../layout/button/QuantityControlButton';

export default function OptionSelector({
  product,
  onTotalPriceChange = () => {},
  onOptionsChange = () => {},
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const optionList = useMemo(() => {
    const arr = Array.isArray(product?.productOptions)
      ? product.productOptions
      : [];
    return arr.map(o => ({
      label: o.optName,
      value: String(o.optId),
      name: o.optName,
      id: o.optId,
    }));
  }, [product]);

  const unitPrice = useMemo(() => {
    const price = Number(product?.price ?? 0);
    const dPrice = Number(product?.discountPrice ?? price);
    return dPrice || price;
  }, [product]);

  useEffect(() => {
    const total = selectedOptions.reduce(
      (sum, opt) => sum + unitPrice * opt.quantity,
      0,
    );
    onTotalPriceChange(total);
    onOptionsChange(selectedOptions);
  }, [selectedOptions, unitPrice, onTotalPriceChange, onOptionsChange]);

  const handleOptionChange = value => {
    if (!value) return;

    const meta = optionList.find(o => String(o.value) === String(value));
    if (!meta) return;

    setSelectedOptions(prev => {
      const i = prev.findIndex(p => p.value === meta.value);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      } else {
        return [...prev, { value: meta.value, name: meta.name, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (value, q) => {
    setSelectedOptions(prev =>
      prev.map(p => (p.value === value ? { ...p, quantity: q } : p)),
    );
  };

  const removeOption = value => {
    setSelectedOptions(prev => prev.filter(p => p.value !== value));
  };

  return (
    <div className='flex flex-col gap-4 border-b border-gray-500 pb-4'>
      {optionList.length > 0 && (
        <Select
          options={optionList.map(o => ({ label: o.label, value: o.value }))}
          value=''
          onChange={handleOptionChange}
          className='w-full pb-4 items-center mt-4'
          placeholder='옵션을 선택하세요'
        />
      )}

      {selectedOptions.length > 0 && (
        <ul className='flex flex-col gap-3'>
          {selectedOptions.map(opt => (
            <li key={opt.value} className='text-start w-full'>
              <div className='flex items-center w-full'>
                <span className='text-gray-900 font-semibold'>{opt.name}</span>
                <button
                  onClick={() => removeOption(opt.value)}
                  className='hover:text-red-700 text-sm px-2 py-1 rounded'
                >
                  ✕
                </button>
              </div>

              <div className='flex justify-between items-center w-full mt-2'>
                <QuantityControlButton
                  value={opt.quantity}
                  setValue={q => handleQuantityChange(opt.value, q)}
                />
                <span className='text-gray-900 font-semibold'>
                  {(unitPrice * opt.quantity).toLocaleString()}원
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
