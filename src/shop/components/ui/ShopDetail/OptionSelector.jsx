import { useEffect, useMemo, useState } from 'react';
import Select from '../Select';
import QuantityControlButton from '../../../layout/button/QuantityControlButton';

export default function OptionSelector({
  product,
  onTotalPriceChange = () => {},
  onOptionsChange = () => {},
}) {
  // 각 optionType별 선택값을 저장 { [optionTypeId]: optionValueId }
  const [selections, setSelections] = useState({});
  // 최종 선택된 옵션 조합 리스트
  const [selectedOptions, setSelectedOptions] = useState([]);

  // optionTypes 배열 파싱
  const optionTypes = useMemo(() => {
    const types = Array.isArray(product?.optionTypes)
      ? product.optionTypes
      : [];
    return types
      .filter(type => type.optionValues && type.optionValues.length > 0)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(type => ({
        typeId: type.optionTypeId,
        typeName: type.typeName,
        isRequired: type.isRequired === 1,
        sortOrder: type.sortOrder,
        options: (type.optionValues || [])
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map(v => ({
            label: v.valueName,
            value: String(v.optionValueId),
            name: v.valueName,
            id: v.optionValueId,
            priceAdjustment: v.priceAdjustment || 0,
            stockStatus: v.stockStatus,
          })),
      }));
  }, [product]);

  const unitPrice = useMemo(() => {
    const basePrice = Number(product?.basePrice ?? product?.price ?? 0);
    const dPrice = Number(product?.discountPrice ?? basePrice);
    return dPrice || basePrice;
  }, [product]);

  // 옵션이 없는 상품인지 확인
  const hasNoOptions = optionTypes.length === 0;

  // 옵션이 없는 상품일 경우 기본 상품 자동 등록
  useEffect(() => {
    if (hasNoOptions && selectedOptions.length === 0) {
      setSelectedOptions([
        {
          combinationKey: 'default',
          name: product?.name || '기본 상품',
          quantity: 1,
          totalPriceAdjustment: 0,
          selectedInfos: [],
        },
      ]);
    }
  }, [hasNoOptions, product?.name]);

  // 총 가격 및 옵션 변경 콜백
  useEffect(() => {
    const total = selectedOptions.reduce(
      (sum, opt) =>
        sum + (unitPrice + (opt.totalPriceAdjustment || 0)) * opt.quantity,
      0,
    );
    onTotalPriceChange(total);
    onOptionsChange(selectedOptions);
  }, [selectedOptions, unitPrice, onTotalPriceChange, onOptionsChange]);

  // 특정 optionType의 선택값 변경
  const handleSelectChange = (typeId, value) => {
    setSelections(prev => ({
      ...prev,
      [typeId]: value || null,
    }));
  };

  // 모든 필수 옵션이 선택되었는지 확인
  const allRequiredSelected = useMemo(() => {
    return optionTypes
      .filter(type => type.isRequired)
      .every(type => selections[type.typeId]);
  }, [optionTypes, selections]);

  // 선택 추가 버튼 클릭
  const handleAddOption = () => {
    if (!allRequiredSelected) return;

    // 선택된 옵션들의 정보 수집
    const selectedInfos = optionTypes
      .filter(type => selections[type.typeId])
      .map(type => {
        const opt = type.options.find(o => o.value === selections[type.typeId]);
        return {
          typeId: type.typeId,
          typeName: type.typeName,
          optionValueId: opt?.id,
          optionName: opt?.name,
          priceAdjustment: opt?.priceAdjustment || 0,
        };
      });

    // 조합 키 생성 (중복 체크용)
    const combinationKey = selectedInfos.map(s => s.optionValueId).join('-');
    const combinationName = selectedInfos
      .map(s => `${s.typeName}: ${s.optionName}`)
      .join(' / ');
    const totalPriceAdjustment = selectedInfos.reduce(
      (sum, s) => sum + s.priceAdjustment,
      0,
    );

    setSelectedOptions(prev => {
      const existingIndex = prev.findIndex(
        p => p.combinationKey === combinationKey,
      );
      if (existingIndex >= 0) {
        // 이미 같은 조합이 있으면 수량 증가
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      } else {
        // 새로운 조합 추가
        return [
          ...prev,
          {
            combinationKey,
            name: combinationName,
            quantity: 1,
            totalPriceAdjustment,
            selectedInfos,
          },
        ];
      }
    });

    // 선택 초기화
    setSelections({});
  };

  const handleQuantityChange = (combinationKey, q) => {
    setSelectedOptions(prev =>
      prev.map(p =>
        p.combinationKey === combinationKey ? { ...p, quantity: q } : p,
      ),
    );
  };

  const removeOption = combinationKey => {
    setSelectedOptions(prev =>
      prev.filter(p => p.combinationKey !== combinationKey),
    );
  };

  return (
    <div className='flex flex-col gap-4 border-b border-gray-500 pb-4'>
      {optionTypes.length > 0 && (
        <div className='flex flex-col gap-3'>
          {optionTypes.map(type => (
            <div key={type.typeId}>
              <label className='text-sm text-gray-700 mb-1 block'>
                {type.typeName}
                {type.isRequired && (
                  <span className='text-red-500 ml-1'>*</span>
                )}
              </label>
              <Select
                options={type.options.map(o => {
                  const isSoldOut = o.stockStatus === 0;
                  let label = o.label;
                  if (o.priceAdjustment > 0) {
                    label = `${o.label} (+${o.priceAdjustment.toLocaleString()}원)`;
                  } else if (o.priceAdjustment < 0) {
                    label = `${o.label} (${o.priceAdjustment.toLocaleString()}원)`;
                  }
                  if (isSoldOut) {
                    label = `${label} (품절)`;
                  }
                  return {
                    label,
                    value: o.value,
                    disabled: isSoldOut,
                  };
                })}
                value={selections[type.typeId] || ''}
                onChange={value => handleSelectChange(type.typeId, value)}
                className='w-full'
                placeholder={`${type.typeName}을(를) 선택하세요`}
              />
            </div>
          ))}

          <button
            onClick={handleAddOption}
            disabled={!allRequiredSelected}
            className={`w-full py-2 rounded text-sm font-medium ${
              allRequiredSelected
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            옵션 선택 추가
          </button>
        </div>
      )}

      {selectedOptions.length > 0 && (
        <ul className='flex flex-col gap-3'>
          {selectedOptions.map(opt => (
            <li
              key={opt.combinationKey}
              className='text-start w-full p-3 rounded'
            >
              <div className='flex items-center w-full'>
                <span className='text-gray-900 font-semibold truncate max-w-[300px] text-sm'>
                  {opt.name}
                </span>
                {!hasNoOptions && (
                  <button
                    onClick={() => removeOption(opt.combinationKey)}
                    className='hover:text-red-700 text-sm px-2 py-1 rounded ml-auto'
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className='flex justify-between items-center w-full mt-2'>
                <QuantityControlButton
                  value={opt.quantity}
                  setValue={q => handleQuantityChange(opt.combinationKey, q)}
                />
                <span className='text-gray-900 font-semibold'>
                  {(
                    (unitPrice + (opt.totalPriceAdjustment || 0)) *
                    opt.quantity
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
