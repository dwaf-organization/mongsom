import { useState, useEffect } from 'react';
import AddressSearchButton from './AddressSearchButton';

export default function AddressInput({
  id,
  label,
  required = false,
  value = { zipCode: '', address: '', address2: '' },
  onChange,
  className = '',
  showExtraAddress = true,
  variant = 'signup',
  error = null,
  readOnly,
}) {
  const [addressData, setAddressData] = useState(value);

  useEffect(() => {
    setAddressData(value);
  }, [value]);

  const handleAddressSelect = data => {
    const newAddressData = {
      address: data.roadAddress || data.address,
      zipCode: data.zonecode,
      roadAddress: data.roadAddress,
      jibunAddress: data.jibunAddress,
      address2: addressData.address2,
    };

    setAddressData(newAddressData);
    if (onChange) {
      onChange(newAddressData);
    }
  };

  const handleDetailChange = e => {
    const newAddressData = {
      ...addressData,
      address2: e.target.value,
    };

    setAddressData(newAddressData);
    if (onChange) {
      onChange(newAddressData);
    }
  };

  if (variant === 'signup') {
    return (
      <div
        className={`flex flex-col gap-2 border-b border-gray-400 pb-6 ${className}`}
      >
        <label htmlFor={id} className='flex items-center gap-10 md:gap-20'>
          <span className='min-w-[90px] text-left'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </span>
          <div className='flex flex-col gap-3 w-full '>
            <div className='flex items-center gap-2'>
              <input
                id={id}
                type='text'
                value={addressData.zipCode}
                className='border border-gray-400 rounded-md w-full p-3 focus:outline-none'
                readOnly
                placeholder='우편번호'
              />
              {!readOnly && (
                <AddressSearchButton onAddressSelect={handleAddressSelect} />
              )}
            </div>

            {showExtraAddress && (
              <input
                type='text'
                value={addressData.address}
                className='border border-gray-400 rounded-md p-3 w-full focus:outline-none'
                readOnly
                placeholder='도로명주소'
              />
            )}

            <input
              type='text'
              value={addressData.address2 || ''}
              onChange={handleDetailChange}
              readOnly={readOnly}
              className={`border rounded-md p-3 w-full focus:outline-primary-200 ${
                error ? 'border-red-500' : 'border-gray-400'
              } ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
          </div>
        </label>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className={`flex flex-col items-start gap-2 w-full ${className}`}
    >
      <span className='text-left'>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </span>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex items-center w-full gap-2'>
          <input
            id={id}
            type='text'
            value={addressData.zipCode}
            className={`border border-gray-400 rounded-md p-2 max-w-[800px] w-full focus:outline-none ${
              readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            readOnly
            placeholder='우편번호'
          />
          {!readOnly && (
            <AddressSearchButton onAddressSelect={handleAddressSelect} />
          )}
        </div>

        {showExtraAddress && (
          <input
            type='text'
            value={addressData.address}
            className={`border border-gray-400 rounded-md p-2 w-full focus:outline-none ${
              readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            readOnly
            placeholder='도로명주소'
          />
        )}

        <input
          type='text'
          placeholder='상세주소를 입력하세요'
          value={addressData.address2 || ''}
          onChange={handleDetailChange}
          readOnly={readOnly}
          className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 ${
            readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
        {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
      </div>
    </label>
  );
}
