import AddressFormField from '../../ui/AddressFormField';
import AddressInput from '../../ui/AddressInput';
import { useState, useEffect } from 'react';
import { OrderSchema } from '../../../schema/OrderSchema';
import { toFormState } from '../../../utils/formUtils';

export default function AddressInfoSection({ onFormValidChange, userInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: { zipCode: '', address: '', address2: '' },
    additionalInfo: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedAddressType, setSelectedAddressType] = useState('existing');

  useEffect(() => {
    if (userInfo && selectedAddressType === 'existing') {
      const raw = userInfo;
      const base = toFormState(raw);

      setFormData(prev => ({
        ...prev,
        name: base.name || '',
        phone1: base.phone1 || '',
        phone2: base.phone2 || '',
        phone3: base.phone3 || '',
        address: {
          zipCode: base.address?.zipCode || '',
          address: base.address?.address || '',
          address2: base.address?.address2 || '',
        },
      }));
    }
  }, [userInfo, selectedAddressType]);

  const handleAddressTypeChange = type => {
    setSelectedAddressType(type);
    if (type === 'new') {
      setFormData(prev => ({
        ...prev,
        name: '',
        phone1: '',
        phone2: '',
        phone3: '',
        address: { zipCode: '', address: '', address2: '' },
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = addr => {
    const normalized = {
      zipCode: addr.zipCode ?? addr.zonecode ?? '',
      address: addr.address ?? addr.baseAddress ?? addr.roadAddress ?? '',
      address2:
        addr.address2 ?? addr.addressDetail ?? addr.userDetailAddress ?? '',
    };
    setFormData(prev => ({ ...prev, address: normalized }));
  };

  useEffect(() => {
    const forValidate = {
      name: formData.name,
      phone1: formData.phone1,
      phone2: formData.phone2,
      phone3: formData.phone3,
      zipCode: formData.address.zipCode,
      address: formData.address.address,
      address2: formData.address.address2,
    };

    const result = OrderSchema.safeParse(forValidate);
    const isValid = result.success;

    if (!isValid && result.error) {
      const next = {};
      result.error.issues.forEach(issue => {
        next[issue.path[0]] = issue.message;
      });
      setErrors(next);
    } else {
      setErrors({});
    }

    if (onFormValidChange) {
      const customerData = isValid
        ? {
            name: formData.name,
            phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
            address:
              `${formData.address.address} ${formData.address.address2}`.trim(),
            zipCode: formData.address.zipCode,
            additionalInfo: formData.additionalInfo,
          }
        : null;

      onFormValidChange(isValid, customerData);
    }
  }, [formData, onFormValidChange]);

  return (
    <section className='py-10'>
      <h3 className='text-xl text-left font-semibold mb-4'>배송지 정보</h3>
      <p className='text-left mb-2'>주소록 선택</p>

      <div className='flex items-center gap-4 mb-4'>
        <label htmlFor='existing-address' className='flex items-center gap-2'>
          <input
            type='radio'
            name='addressType'
            id='existing-address'
            checked={selectedAddressType === 'existing'}
            onChange={() => handleAddressTypeChange('existing')}
          />
          <p>기존 배송지 정보</p>
        </label>
        <label htmlFor='new-address' className='flex items-center gap-2'>
          <input
            type='radio'
            name='addressType'
            id='new-address'
            checked={selectedAddressType === 'new'}
            onChange={() => handleAddressTypeChange('new')}
          />
          <p>신규 배송지 정보</p>
        </label>
      </div>

      <form className='flex flex-col gap-4 w-full'>
        <AddressFormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
          error={errors.name}
          readOnly={selectedAddressType === 'existing'}
        />

        <AddressFormField id='phonenumber' label='휴대전화' required>
          <div className='flex items-center gap-2 w-full'>
            <input
              id='phone1'
              type='text'
              maxLength={3}
              value={formData.phone1}
              onChange={e => handleInputChange('phone1', e.target.value)}
              readOnly={selectedAddressType === 'existing'}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 ${
                selectedAddressType === 'existing'
                  ? 'bg-gray-100 cursor-not-allowed'
                  : ''
              }`}
            />
            -
            <input
              id='phone2'
              type='text'
              maxLength={4}
              value={formData.phone2}
              onChange={e => handleInputChange('phone2', e.target.value)}
              readOnly={selectedAddressType === 'existing'}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 ${
                selectedAddressType === 'existing'
                  ? 'bg-gray-100 cursor-not-allowed'
                  : ''
              }`}
            />
            -
            <input
              id='phone3'
              type='text'
              maxLength={4}
              value={formData.phone3}
              onChange={e => handleInputChange('phone3', e.target.value)}
              readOnly={selectedAddressType === 'existing'}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 ${
                selectedAddressType === 'existing'
                  ? 'bg-gray-100 cursor-not-allowed'
                  : ''
              }`}
            />
          </div>
          {(errors.phone1 || errors.phone2 || errors.phone3) && (
            <p className='text-red-500 text-xs mt-1'>
              {errors.phone1 || errors.phone2 || errors.phone3}
            </p>
          )}
        </AddressFormField>

        <AddressInput
          id='address'
          label='주소'
          required
          variant='order'
          value={{
            zipCode: formData.address.zipCode,
            address: formData.address.address,
            address2: formData.address.address2,
          }}
          onChange={handleAddressChange}
          error={errors.address || errors.userDetailAddress}
          readOnly={selectedAddressType === 'existing'}
        />

        <label
          htmlFor='additionalInfo'
          className='text-lg font-semibold text-left py-10'
        >
          <span className='w-full'>배송메시지</span>
          <textarea
            id='additionalInfo'
            value={formData.additionalInfo}
            onChange={e => handleInputChange('additionalInfo', e.target.value)}
            className='border border-gray-400 rounded-md p-2 w-full resize-none focus:outline-primary-200'
            placeholder='배송메시지를 입력하세요'
          />
        </label>
      </form>
    </section>
  );
}
