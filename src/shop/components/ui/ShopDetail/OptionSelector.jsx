import { useEffect, useMemo, useState } from 'react';
import Select from '../Select';
import QuantityControlButton from '../../../layout/button/QuantityControlButton';

export default function OptionSelector({
  product,
  onTotalPriceChange = () => {},
  onOptionsChange = () => {},
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // 새로운 형식: optionTypes 배열 (각 optionType에 optionValues 배열)
  const optionTypes = useMemo(() => {
    const types = Array.isArray(product?.optionTypes) ? product.optionTypes : [];
    return types.map(type => ({
      typeId: type.optionTypeId,
      typeName: type.typeName,
      isRequired: type.isRequired === 1,
      options: (type.optionValues || []).map(v => ({
        label: v.valueName,
        value: String(v.optionValueId),
        name: v.valueName,
        id: v.optionValueId,
        priceAdjustment: v.priceAdjustment || 0,
      })),
    }));
  }, [product]);

  // 기존 형식 호환: productOptions
  const legacyOptionList = useMemo(() => {
    const arr = Array.isArray(product?.productOptions)
      ? product.productOptions
      : [];
    return arr.map(o => ({
      label: o.optName,
      value: String(o.optId),
      name: o.optName,
      id: o.optId,
      priceAdjustment: 0,
    }));
  }, [product]);

  // 새로운 형식 또는 기존 형식에서 옵션 리스트 가져오기
  const optionList = useMemo(() => {
    // 새로운 형식이 있으면 모든 optionTypes의 옵션들을 합침
    if (optionTypes.length > 0) {
      return optionTypes.flatMap(type =>
        type.options.map(opt => ({
          ...opt,
          typeId: type.typeId,
          typeName: type.typeName,
        }))
      );
    }
    return legacyOptionList;
  }, [optionTypes, legacyOptionList]);

  const unitPrice = useMemo(() => {
    // 새로운 형식: basePrice 또는 기존 형식: price
    const basePrice = Number(product?.basePrice ?? product?.price ?? 0);
    const dPrice = Number(product?.discountPrice ?? basePrice);
    return dPrice || basePrice;
  }, [product]);

  useEffect(() => {
    const total = selectedOptions.reduce(
      (sum, opt) => sum + (unitPrice + (opt.priceAdjustment || 0)) * opt.quantity,
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
        return [
          ...prev,
          {
            value: meta.value,
            name: meta.name,
            quantity: 1,
            priceAdjustment: meta.priceAdjustment || 0,
            typeName: meta.typeName,
          },
        ];
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
                <span className='text-gray-900 font-semibold truncate max-w-[300px]'>
                  {opt.name}
                </span>
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
                  {((unitPrice + (opt.priceAdjustment || 0)) * opt.quantity).toLocaleString()}원
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
