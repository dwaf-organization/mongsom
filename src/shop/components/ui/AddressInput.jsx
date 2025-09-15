import { useState } from 'react';
import AddressSearchButton from './AddressSearchButton';

export default function AddressInput({
  id,
  label,
  required = false,
  value = { address: '', addressDetail: '' },
  onChange,
  className = '',
  showExtraAddress = true,
  variant = 'signup',
  error = null,
}) {
  const [addressData, setAddressData] = useState(value);

  const handleAddressSelect = data => {
    const newAddressData = {
      address: data.zonecode || '',
      addressDetail: data.roadAddress || data.address,
      zonecode: data.zonecode,
      roadAddress: data.roadAddress,
      jibunAddress: data.jibunAddress,
      userDetailAddress: addressData.userDetailAddress || '',
    };

    setAddressData(newAddressData);
    if (onChange) {
      onChange(newAddressData);
    }
  };

  const handleDetailChange = e => {
    const newAddressData = {
      ...addressData,
      userDetailAddress: e.target.value,
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
        <label htmlFor={id} className='flex items-center gap-20'>
          <span className='min-w-[90px] text-left'>
            {label}
            {required && <span className='text-red-500'>*</span>}
          </span>
          <div className='flex flex-col gap-3 w-full '>
            <div className='flex items-center gap-2'>
              <input
                id={id}
                type='text'
                value={addressData.zonecode}
                className='border border-gray-400 rounded-md w-full p-3 focus:outline-none'
                readOnly
                placeholder='우편번호'
              />
              <AddressSearchButton onAddressSelect={handleAddressSelect} />
            </div>

            {showExtraAddress && (
              <input
                type='text'
                value={addressData.addressDetail}
                className='border border-gray-400 rounded-md p-3 w-full focus:outline-none'
                readOnly
                placeholder='도로명주소'
              />
            )}

            <input
              type='text'
              value={addressData.userDetailAddress || ''}
              onChange={handleDetailChange}
              className={`border rounded-md p-3 w-full focus:outline-primary-200 ${
                error ? 'border-red-500' : 'border-gray-400'
              }`}
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
      <span className='text-left text-lg'>
        {label}
        {required && <span className='text-red-500'>*</span>}
      </span>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex items-center w-full gap-2'>
          <input
            id={id}
            type='text'
            value={addressData.address}
            className='border border-gray-400 rounded-md p-2 max-w-[800px] w-full focus:outline-none'
            readOnly
            placeholder='우편번호'
          />
          <AddressSearchButton onAddressSelect={handleAddressSelect} />
        </div>

        {showExtraAddress && (
          <input
            type='text'
            value={addressData.addressDetail}
            className='border border-gray-400 rounded-md p-2 w-full focus:outline-none'
            readOnly
            placeholder='도로명주소'
          />
        )}

        <input
          type='text'
          placeholder='상세주소를 입력하세요'
          value={addressData.userDetailAddress || ''}
          onChange={handleDetailChange}
          className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 `}
        />
        {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
      </div>
    </label>
  );
}
