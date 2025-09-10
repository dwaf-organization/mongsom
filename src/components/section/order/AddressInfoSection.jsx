import AddressFormField from '../../ui/AddressFormField';
import AddressInput from '../../ui/AddressInput';
import { useState, useEffect } from 'react';
import { OrderSchema } from '../../../schema/OrderSchema';

export default function AddressInfoSection({ onFormValidChange }) {
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: '',
    addressDetail: '',
    userDetailAddress: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState({});

  const handleAddressChange = newAddressData => {
    setFormData(prev => ({
      ...prev,
      address: newAddressData.address,
      addressDetail: newAddressData.addressDetail,
      userDetailAddress: newAddressData.userDetailAddress || '',
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const result = OrderSchema.safeParse(formData);
    const isValid = result.success;

    if (!result.success && result.error) {
      const newErrors = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
    } else {
      setErrors({});
    }

    if (onFormValidChange) {
      const customerData = isValid
        ? {
            name: formData.name,
            email: '',
            phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
            address:
              `${formData.address} ${formData.addressDetail} ${formData.userDetailAddress}`.trim(),
            additionalInfo: formData.additionalInfo,
          }
        : null;

      onFormValidChange(isValid, customerData);
    }
  }, [formData, onFormValidChange]);

  return (
    <section className='py-10'>
      <h3 className='text-xl text-left font-semibold mb-4 '>배송지 정보</h3>
      <form className='flex flex-col gap-4 w-full'>
        <AddressFormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
          error={errors.name}
        />
        <AddressFormField id='phonenumber' label='휴대전화' required class>
          <div className='flex items-center gap-2 w-full'>
            <input
              id='phone1'
              type='text'
              name='phone1'
              maxLength='3'
              value={formData.phone1}
              onChange={e => handleInputChange('phone1', e.target.value)}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 $`}
            />
            -
            <input
              id='phone2'
              type='text'
              name='phone2'
              maxLength='4'
              value={formData.phone2}
              onChange={e => handleInputChange('phone2', e.target.value)}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 `}
            />
            -
            <input
              id='phone3'
              type='text'
              name='phone3'
              maxLength='4'
              value={formData.phone3}
              onChange={e => handleInputChange('phone3', e.target.value)}
              className={`border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200 `}
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
          value={{
            address: formData.address,
            addressDetail: formData.addressDetail,
            userDetailAddress: formData.userDetailAddress,
          }}
          onChange={handleAddressChange}
          variant='order'
          error={errors.address || errors.userDetailAddress}
        />
        <label
          htmlFor='additionalInfo'
          className='text-lg font-semibold text-left py-10'
        >
          <span className='w-full '>배송메시지</span>
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
