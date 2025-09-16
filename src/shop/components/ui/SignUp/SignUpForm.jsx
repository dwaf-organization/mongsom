import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../ui/button';
import AdditionalInfoInput from './AdditionalInfoInput';
import FormField from './FormField';
import AddressInput from '../AddressInput';

import { SignUpSchema } from '../../../schema/SignUpSchema';
import { useToast } from '../../../context/ToastContext';
import { signUp, checkId } from '../../../api/signUp';

export default function SignUpForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    // 주소 키 통일 (백엔드 스펙에 맞춰 사용)
    address: { zipcode: '', baseAddress: '', detailAddress: '' },
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // 아이디 중복확인 상태
  // 'idle' | 'checking' | 'available' | 'taken' | 'error'
  const [idStatus, setIdStatus] = useState('idle');
  const [lastCheckedId, setLastCheckedId] = useState('');

  const isValidUserIdFormat = v => /^[a-z0-9]{4,16}$/.test(v);
  const onlyDigits = v => v.replace(/\D/g, '');

  // 비밀번호 일치 에러
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다.',
        }));
      } else {
        setErrors(prev => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  }, [formData.password, formData.confirmPassword]);

  // 필수값 + 주소 + 중복확인까지 포함해서 폼 활성화
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
      field => String(formData[field] ?? '').trim() !== '',
    );

    const addressFilled =
      String(formData.address.zipcode ?? '').trim() !== '' &&
      String(formData.address.baseAddress ?? '').trim() !== '';

    const userIdTrimmed = formData.userId.trim();

    const idReady =
      idStatus === 'available' &&
      lastCheckedId &&
      lastCheckedId === userIdTrimmed &&
      isValidUserIdFormat(userIdTrimmed);

    setIsFormValid(
      allFieldsFilled && addressFilled && !errors.confirmPassword && idReady,
    );
  }, [formData, errors.confirmPassword, idStatus, lastCheckedId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 아이디가 바뀌면 중복확인 상태 초기화
    if (field === 'userId') {
      setIdStatus('idle');
      setLastCheckedId('');
    }
  };

  const handleAddressChange = addressData => {
    setFormData(prev => ({ ...prev, address: addressData }));
  };

  const handleCheckUserId = async () => {
    const id = formData.userId.trim();
    if (!id) return addToast('아이디를 입력해주세요.', 'error');
    if (!isValidUserIdFormat(id)) {
      return addToast('아이디는 영소문자/숫자 4~16자입니다.', 'error');
    }

    try {
      setIdStatus('checking');
      const res = await checkId(id);

      // 권장: { isSuccess: true, result: { available: boolean } }
      let available;
      if (typeof res?.result?.available === 'boolean') {
        available = res.result.available;
      } else if (typeof res?.available === 'boolean') {
        available = res.available;
      } else if (res?.code === 409) {
        available = false;
      } else if (res?.code === 200) {
        // 일부 API는 200이면 사용가능으로 간주하는 경우가 있음
        available = true;
      }

      if (available === true) {
        setIdStatus('available');
        setLastCheckedId(id);
        addToast('사용 가능한 아이디입니다.', 'success');
      } else if (available === false) {
        setIdStatus('taken');
        setLastCheckedId(id);
        addToast('이미 사용 중인 아이디입니다.', 'error');
      } else {
        setIdStatus('error');
        addToast('중복 확인 응답 형식을 확인해주세요.', 'error');
      }
    } catch (e) {
      setIdStatus('error');
      addToast('중복 확인 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;

    const userIdTrimmed = formData.userId.trim();

    // 중복확인 강제
    if (!isValidUserIdFormat(userIdTrimmed)) {
      addToast('아이디는 영소문자/숫자 4~16자입니다.', 'error');
      return;
    }
    if (!(idStatus === 'available' && lastCheckedId === userIdTrimmed)) {
      addToast('아이디 중복확인을 먼저 진행해주세요.', 'error');
      return;
    }

    // 비밀번호 일치
    if (formData.password !== formData.confirmPassword) {
      addToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    // Zod 검증
    const result = SignUpSchema.safeParse({
      ...formData,
      phone: [formData.phone1, formData.phone2, formData.phone3].join('-'),
    });
    if (!result.success) {
      const first = result.error?.issues?.[0];
      addToast(first?.message || '입력 정보를 확인해주세요.', 'error');
      return;
    }

    setLoading(true);
    try {
      const resp = await signUp({
        ...result.data,
        // 주소 shape 최종 확정 (백엔드 스펙 맞추기)
        address: {
          zipcode: formData.address.zipcode,
          baseAddress: formData.address.baseAddress,
          detailAddress: formData.address.detailAddress,
        },
      });

      if (resp?.isSuccess) {
        addToast('회원가입이 완료되었습니다!', 'success');
        navigate('/login', { replace: true });
      } else {
        addToast(resp?.message || '회원가입에 실패했습니다.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('회원가입 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='flex flex-col justify-center py-6 space-y-6 '>
        <FormField
          id='userId'
          label='아이디'
          required
          message='(영문 소문자/숫자 , 4~16자)'
        >
          <div className='flex items-center gap-2 w-full'>
            <input
              type='text'
              value={formData.userId}
              onChange={e => handleInputChange('userId', e.target.value)}
              placeholder='아이디를 입력하세요'
              minLength={4}
              maxLength={16}
              autoComplete='username'
              className='border rounded-md p-2 w-full max-w-[370px] focus:outline-primary-200 border-gray-400'
            />
            <Button
              type='button'
              onClick={handleCheckUserId}
              disabled={
                !isValidUserIdFormat(formData.userId) || idStatus === 'checking'
              }
              className='w-fit px-8  py-2 text-lg'
            >
              {idStatus === 'checking'
                ? '확인 중...'
                : idStatus === 'available'
                  ? '사용가능'
                  : '중복확인'}
            </Button>
          </div>
          {idStatus === 'taken' && (
            <p className='text-red-500 text-sm mt-1'>
              이미 사용 중인 아이디입니다.
            </p>
          )}
          {idStatus === 'available' &&
            lastCheckedId === formData.userId.trim() && (
              <p className='text-green-600 text-sm mt-1'>
                이 아이디로 가입할 수 있습니다.
              </p>
            )}
        </FormField>

        <FormField
          id='password'
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          message='(영문 대소문자/숫자/특수문자 중 2개 이상, 8~20자)'
          value={formData.password}
          onChange={e => handleInputChange('password', e.target.value)}
          autoComplete='new-password'
        />

        <FormField
          id='confirmPassword'
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호를 다시 입력하세요'
          required
          error={errors.confirmPassword}
          value={formData.confirmPassword}
          onChange={e => handleInputChange('confirmPassword', e.target.value)}
          autoComplete='new-password'
        />

        <FormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
          autoComplete='name'
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
              inputMode='numeric'
              value={formData.phone1}
              onChange={e =>
                handleInputChange('phone1', onlyDigits(e.target.value))
              }
              placeholder='010'
              maxLength={3}
              autoComplete='tel-local-prefix'
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              inputMode='numeric'
              value={formData.phone2}
              onChange={e =>
                handleInputChange('phone2', onlyDigits(e.target.value))
              }
              placeholder='1234'
              maxLength={4}
              autoComplete='tel-local-suffix'
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              inputMode='numeric'
              value={formData.phone3}
              onChange={e =>
                handleInputChange('phone3', onlyDigits(e.target.value))
              }
              placeholder='5678'
              maxLength={4}
              autoComplete='tel-local-suffix'
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
            autoComplete='email'
            className='border rounded-md p-3 flex-1 focus:outline-primary-200 border-gray-400'
          />
        </FormField>
      </section>

      <AdditionalInfoInput />

      <Button
        type='submit'
        className={`w-full p-4 mt-11 mx-auto text-2xl ${
          !isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!isFormValid || loading}
      >
        {loading ? '처리 중…' : '회원가입'}
      </Button>
    </form>
  );
}
