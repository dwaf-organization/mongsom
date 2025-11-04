import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../ui/button';
import FormField from './FormField';
import AddressInput from '../AddressInput';

import { SignUpSchema } from '../../../schema/SignUpSchema';
import { useToast } from '../../../context/ToastContext';
import { signUp, checkId } from '../../../api/signUp';
import { useModal } from '../../../context/ModalContext';
import AgreeModal from '../AgreeModal';

export default function SignUpForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { openModal } = useModal();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: { zipCode: '', address: '', address2: '' },
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
    birth: '',
    agreeMain: false,
    agreeShopping: false,
    agreeSms: false,
    agreeEmail: false,
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const [idStatus, setIdStatus] = useState('idle');
  const [lastCheckedId, setLastCheckedId] = useState('');

  const isValidUserIdFormat = v => /^[a-z0-9]{4,16}$/.test(v);
  const onlyDigits = v => v.replace(/\D/g, '');

  // 숫자만 남기고 최대 11자리(010 기준)
  const digits11 = v => (v || '').replace(/\D/g, '').slice(0, 11);

  // 01012345678 → "010-1234-5678" 포맷 표시용
  const formatMobilePhone = digits => {
    const d = digits11(digits);
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 7);
    const p3 = d.slice(7, 11);
    if (!p1) return '';
    if (!p2) return p1;
    if (!p3) return `${p1}-${p2}`;
    return `${p1}-${p2}-${p3}`;
  };

  // 모바일 단일 인풋 onChange 핸들러: 내부 state를 3-4-4로 쪼개 저장
  const handlePhoneUnifiedChange = raw => {
    const d = digits11(raw);
    setFormData(prev => ({
      ...prev,
      phone1: d.slice(0, 3),
      phone2: d.slice(3, 7),
      phone3: d.slice(7, 11),
    }));
  };

  // 단일 인풋 value(표시용)
  const unifiedPhoneValue = formatMobilePhone(
    `${formData.phone1 ?? ''}${formData.phone2 ?? ''}${formData.phone3 ?? ''}`,
  );

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
      String(formData.address.zipCode ?? '').trim() !== '' &&
      String(formData.address.address ?? '').trim() !== '';

    const userIdTrimmed = formData.userId.trim();
    const idReady =
      idStatus === 'available' &&
      lastCheckedId &&
      lastCheckedId === userIdTrimmed &&
      isValidUserIdFormat(userIdTrimmed);

    const agreed =
      formData.agreeMain === true && formData.agreeShopping === true;

    setIsFormValid(
      allFieldsFilled &&
        addressFilled &&
        !errors.confirmPassword &&
        idReady &&
        agreed,
    );
  }, [formData, errors.confirmPassword, idStatus, lastCheckedId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'userId') {
      setIdStatus('idle');
      setLastCheckedId('');
    }
  };

  const handleAddressChange = addressData => {
    setFormData(prev => ({ ...prev, address: addressData }));
  };

  const handleToggleAgree = field => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
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
      let available = null;
      if (res?.code === 1) available = res.data === true;

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
    } catch {
      setIdStatus('error');
      addToast('중복 확인 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleClick = () => {
    openModal(<AgreeModal />);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;

    const userIdTrimmed = formData.userId.trim();
    if (!isValidUserIdFormat(userIdTrimmed)) {
      addToast('아이디는 영소문자/숫자 4~16자입니다.', 'error');
      return;
    }
    if (!(idStatus === 'available' && lastCheckedId === userIdTrimmed)) {
      addToast('아이디 중복확인을 먼저 진행해주세요.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    if (!formData.agreeMain) {
      addToast('이용 약관에 동의해야 회원가입이 가능합니다.', 'error');
      return;
    }

    if (!formData.agreeShopping) {
      addToast('이용 약관에 동의해야 회원가입이 가능합니다.', 'error');
      return;
    }

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
      const payload = {
        userId: userIdTrimmed,
        password: formData.password,
        name: formData.name,
        zipCode: formData.address.zipCode,
        address: formData.address.address,
        address2: formData.address.address2,
        phone: [formData.phone1, formData.phone2, formData.phone3].join(''),
        email: formData.email,
        birth: formData.birth?.trim() || null,
        agreeMain: formData.agreeMain,
        agreeShopping: formData.agreeShopping,
        agreeSms: formData.agreeSms,
        agreeEmail: formData.agreeEmail,
        provider: 'LOCAL',
      };

      const resp = await signUp(payload);
      if (resp?.code === 1) {
        addToast('회원가입이 완료되었습니다!', 'success');
        navigate('/login', { replace: true });
      } else {
        addToast(resp?.message || '회원가입에 실패했습니다.', 'error');
      }
    } catch {
      addToast('회원가입 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className='flex flex-col justify-center space-y-6 py-6'>
        <FormField
          id='userId'
          label='아이디'
          required
          message='(영문 소문자/숫자 , 4~16자)'
        >
          <div className='flex w-full items-center gap-2'>
            <input
              type='text'
              value={formData.userId}
              onChange={e => handleInputChange('userId', e.target.value)}
              placeholder='아이디를 입력하세요'
              minLength={4}
              maxLength={16}
              autoComplete='username'
              className='w-full max-w-[370px] rounded-md border border-gray-400 p-2 focus:outline-primary-200'
            />
            <Button
              type='button'
              onClick={handleCheckUserId}
              disabled={
                !isValidUserIdFormat(formData.userId) || idStatus === 'checking'
              }
              className='w-fit px-4 md:px-8 py-2 text-sm md:text-lg'
            >
              {idStatus === 'checking'
                ? '확인 중...'
                : idStatus === 'available'
                  ? '사용가능'
                  : '중복확인'}
            </Button>
          </div>
          {idStatus === 'taken' && (
            <p className='mt-1 text-sm text-red-500'>
              이미 사용 중인 아이디입니다.
            </p>
          )}
          {idStatus === 'available' &&
            lastCheckedId === formData.userId.trim() && (
              <p className='mt-1 whitespace-nowrap text-sm text-green-600'>
                사용 가능
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
          required
        />

        <FormField id='phone' label='휴대전화' required>
          {/* 📱 모바일: 단일 인풋 */}
          <input
            type='tel'
            inputMode='numeric'
            placeholder='010-1234-5678'
            value={unifiedPhoneValue}
            onChange={e => handlePhoneUnifiedChange(e.target.value)}
            className='w-full rounded-md border border-gray-400 p-3 focus:outline-primary-200 md:hidden'
            maxLength={13} /* 010-1234-5678 */
            autoComplete='tel'
          />

          {/* 💻 md 이상: 기존 3칸 */}
          <div className='hidden md:flex w-full items-center gap-2'>
            <input
              type='text'
              inputMode='numeric'
              value={formData.phone1}
              onChange={e =>
                handleInputChange(
                  'phone1',
                  e.target.value.replace(/\D/g, '').slice(0, 3),
                )
              }
              placeholder='010'
              maxLength={3}
              autoComplete='tel-local-prefix'
              className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              inputMode='numeric'
              value={formData.phone2}
              onChange={e =>
                handleInputChange(
                  'phone2',
                  e.target.value.replace(/\D/g, '').slice(0, 4),
                )
              }
              placeholder='1234'
              maxLength={4}
              autoComplete='tel-local-suffix'
              className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              inputMode='numeric'
              value={formData.phone3}
              onChange={e =>
                handleInputChange(
                  'phone3',
                  e.target.value.replace(/\D/g, '').slice(0, 4),
                )
              }
              placeholder='5678'
              maxLength={4}
              autoComplete='tel-local-suffix'
              className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
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
            className='flex-1 w-full rounded-md border border-gray-400 p-3 focus:outline-primary-200'
          />
        </FormField>
      </section>

      {/* <AdditionalInfoInput /> */}

      <section className='mt-6 space-y-3 rounded-md border border-gray-200 p-4'>
        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={formData.agreeMain}
            onChange={() => handleToggleAgree('agreeMain')}
          />
          <sapn>
            이용 약관 동의 <span className='text-red-500'>(필수)</span>
          </sapn>

          <button
            className='ml-auto text-xs text-gray-500 underline'
            type='button'
            onClick={handleClick}
          >
            약관 보기
          </button>
        </label>

        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={formData.agreeShopping}
            onChange={() => handleToggleAgree('agreeShopping')}
          />
          <sapn>
            개인정보 수집 및 이용 약관 동의
            <span className='text-red-500'>(필수)</span>
          </sapn>
        </label>

        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={formData.agreeSms}
            onChange={() => handleToggleAgree('agreeSms')}
          />
          <span>SMS 수신 동의</span>
        </label>

        <label className='flex items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={formData.agreeEmail}
            onChange={() => handleToggleAgree('agreeEmail')}
          />
          <span>이메일 수신 동의</span>
        </label>
      </section>

      <Button
        type='submit'
        className={`mx-auto mt-11 w-full p-2 md:p-4 text-lg md:text-2xl ${
          !isFormValid || loading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={!isFormValid || loading}
      >
        {loading ? '처리 중…' : '회원가입'}
      </Button>
    </form>
  );
}
