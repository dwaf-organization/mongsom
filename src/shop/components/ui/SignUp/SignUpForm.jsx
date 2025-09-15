import { Button } from '../../ui/button';
import AdditionalInfoInput from './AdditionalInfoInput';
import FormField from './FormField';
import AddressInput from '../AddressInput';
import { useState, useEffect } from 'react';
import { SignUpSchema } from '../../../schema/SignUpSchema';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: { address: '', addressDetail: '', userDetailAddress: '' },
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다.',
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const requiredFields = [
      'userId',
      'password',
      'confirmPassword',
      'name',
      'phone1',
      'phone2',
      'phone3',
      'email',
    ];
    const allFieldsFilled = requiredFields.every(
      field => formData[field]?.trim() !== '',
    );

    setIsFormValid(allFieldsFilled && !errors.confirmPassword);
  }, [formData, errors.confirmPassword]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = addressData => {
    setFormData(prev => ({
      ...prev,
      address: addressData,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const result = SignUpSchema.safeParse(formData);

    if (!result.success) {
      if (
        result.error &&
        result.error.issues &&
        Array.isArray(result.error.issues) &&
        result.error.issues.length > 0
      ) {
        const firstError = result.error.issues[0];

        addToast(firstError.message, 'error');
      } else {
        addToast('입력 정보를 확인해주세요.', 'error');
      }
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    navigate('/login');
    addToast('회원가입이 완료되었습니다!', 'success');
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='flex flex-col justify-center py-6 space-y-6 '>
        <FormField id='userId' label='아이디' required>
          <div className='flex items-center gap-2 w-full'>
            <input
              type='text'
              value={formData.userId}
              onChange={e => handleInputChange('userId', e.target.value)}
              placeholder='아이디를 입력하세요'
              message={'(영문 소문자/숫자 , 4~16자)'}
              minLength={4}
              maxLength={16}
              className='border rounded-md p-2 w-full max-w-[370px] focus:outline-primary-200 border-gray-400'
            />
            <Button type='button' className='w-fit px-8  py-2 text-lg'>
              {' '}
              중복확인{' '}
            </Button>
          </div>
        </FormField>

        <FormField
          id='password'
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          message={'(영문 대소문자/숫자/특수문자 중 2개 이상, 8~20자)'}
          value={formData.password}
          onChange={e => handleInputChange('password', e.target.value)}
        />

        <FormField
          id='confirmPassword'
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          error={errors.confirmPassword}
          value={formData.confirmPassword}
          onChange={e => handleInputChange('confirmPassword', e.target.value)}
        />

        <FormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
        />
        <AddressInput
          id='address'
          label='주소'
          value={formData.address}
          onChange={handleAddressChange}
          placeholder='상세주소를 입력하세요'
          variant='signup'
        />
        <FormField id='phone' label='휴대전화' required>
          <div className='flex items-center gap-2 w-full'>
            <input
              type='text'
              value={formData.phone1}
              onChange={e => handleInputChange('phone1', e.target.value)}
              placeholder='010'
              maxLength={3}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              value={formData.phone2}
              onChange={e => handleInputChange('phone2', e.target.value)}
              placeholder='1234'
              maxLength={4}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              value={formData.phone3}
              onChange={e => handleInputChange('phone3', e.target.value)}
              placeholder='5678'
              maxLength={4}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
          </div>
        </FormField>

        <FormField id='email' label='이메일' required>
          <input
            type='email'
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder='이메일을 입력하세요'
            className='border rounded-md p-3 flex-1 focus:outline-primary-200 border-gray-400'
          />
        </FormField>
      </section>

      <AdditionalInfoInput />
      <Button
        type='submit'
        className={`w-full p-4 mt-11 mx-auto text-2xl ${
          !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!isFormValid}
      >
        회원가입
      </Button>
    </form>
  );
}
