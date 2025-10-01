// src/pages/auth/NaverCallback.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AddressInput from '../../components/ui/AddressInput';
import FormField from '../../components/ui/SignUp/FormField';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { signUp } from '../../api/signUp';
import { getNaverLogin } from '../../api/login';

const onlyDigits = v => (v || '').replace(/\D/g, '');
const splitPhone = mobile => {
  const d = onlyDigits(mobile);
  if (!d) return { p1: '', p2: '', p3: '' };
  // 010-1234-5678 형태 가정
  return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
};

// 안전하게 네이버 프로필 꺼내기
const pickNaverProfile = resp => {
  const r =
    resp?.data?.data?.profile?.response ||
    resp?.result?.profile?.response || // 혹시 다른 스키마 대비
    resp?.data?.profile?.response ||
    null;
  if (!r) return null;
  return {
    id: r.id || '',
    email: r.email || '',
    name: r.name || r.nickname || '',
    mobile: r.mobile || '',
  };
};

export default function NaverCallback() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState('loading'); // loading | form | submitting | done | error
  const [msg, setMsg] = useState('네이버 로그인 처리 중…');
  const [error, setError] = useState(null);

  const [userinfo, setUserinfo] = useState(null);

  // 폼 기본값: 이름/주소/전화
  const [form, setForm] = useState({
    name: '',
    address: { zipCode: '', address: '', address2: '' },
    phone1: '',
    phone2: '',
    phone3: '',
  });

  const handleAddressChange = addressData => {
    setForm(prev => ({ ...prev, address: addressData }));
  };
  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const once = useRef(false);
  const code = useMemo(() => sp.get('code') || '', [sp]);
  const state = useMemo(() => sp.get('state') || '', [sp]);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const run = async () => {
      try {
        const stored = sessionStorage.getItem('NAVER_OAUTH_STATE');
        if (!code || !state) {
          setError('code/state 누락');
          setStep('error');
          return;
        }
        if (stored !== state) {
          setError('state 불일치 (새로고침/다른 탭 가능성)');
          setStep('error');
          return;
        }

        setMsg('회원 여부 확인 중…');
        const resp = await getNaverLogin({ code, state });

        if (resp.code === 1) {
          // 이미 가입자 → 로그인 후 홈
          const userCode = resp?.result ?? resp?.data.userCode; // 서버 스키마에 맞게
          if (!userCode) {
            setError('로그인 응답에 userCode가 없습니다.');
            setStep('error');
            return;
          }
          login({ userData: { userId: 'naver' }, userCode });
          addToast('네이버 로그인 완료', 'success');
          navigate('/', { replace: true });
          return;
        }

        if (resp.code === 2) {
          const ui = pickNaverProfile(resp);
          setUserinfo(ui);

          const { p1, p2, p3 } = splitPhone(ui?.mobile);
          setForm(prev => ({
            ...prev,
            name: ui?.name || '',
            phone1: p1,
            phone2: p2,
            phone3: p3,
          }));

          setStep('form');
          setMsg('추가 정보를 입력하세요.');
          return;
        }

        setError(resp?.message || '네이버 로그인 처리 실패');
        setStep('error');
      } catch (e) {
        console.error(e);
        setError(e.message || '네이버 로그인 처리 실패');
        setStep('error');
      } finally {
        sessionStorage.removeItem('NAVER_OAUTH_STATE');
      }
    };

    run();
  }, [code, state, login, addToast, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    if (step === 'submitting') return;

    if (!form.name.trim()) {
      setError('이름을 입력하세요.');
      setStep('form');
      return;
    }
    if (!form.address?.zipCode?.trim() || !form.address?.address?.trim()) {
      setError('우편번호와 기본주소를 입력하세요.');
      setStep('form');
      return;
    }
    if (!form.phone1?.trim() || !form.phone2?.trim() || !form.phone3?.trim()) {
      setError('휴대전화를 입력하세요.');
      setStep('form');
      return;
    }

    try {
      setError(null);
      setStep('submitting');
      setMsg('회원가입 처리 중…');

      const payload = {
        provider: 'NAVER',
        userId: userinfo?.email,
        email: userinfo?.email || '',
        password: userinfo?.email + userinfo?.name,
        name: form.name.trim(),
        zipCode: form.address.zipCode.trim(),
        address: form.address.address.trim(),
        address2: (form.address.address2 || '').trim(),
        phone: [form.phone1, form.phone2, form.phone3].join(''),
        agreeMain: true,
        agreeShopping: true,
        agreeSms: true,
        agreeEmail: true,
      };

      const resp = await signUp(payload);
      if (resp?.code === 1) {
        const userCode = resp?.result ?? resp?.data;
        if (!userCode) {
          addToast('회원가입은 성공했지만 userCode가 없습니다.', 'error');
        } else {
          login({ userData: { userId: payload.naverId || 'naver' }, userCode });
          addToast('회원가입 및 로그인 완료', 'success');
        }
        navigate('/', { replace: true });
      } else {
        addToast(resp?.message || '회원가입에 실패했습니다.', 'error');
        setStep('form');
      }
    } catch (e) {
      console.error(e);
      setError(e.message || '회원가입 실패');
      setStep('form');
    }
  };

  return (
    <div className='mx-auto max-w-[980px] p-6'>
      <h2 className='mb-2 w-full border-b-2 border-gray-400 pb-4 text-2xl font-bold'>
        네이버 로그인
      </h2>

      {step === 'loading' && <p className='text-sm text-gray-700'>{msg}</p>}

      {step === 'error' && (
        <>
          <p className='text-sm text-red-600'>{error || '처리 실패'}</p>
          <div className='mt-4 text-left text-xs'>
            <div>
              code: <code>{sp.get('code') || '-'}</code>
            </div>
            <div>
              state: <code>{sp.get('state') || '-'}</code>
            </div>
          </div>
        </>
      )}

      {step === 'form' && (
        <form onSubmit={onSubmit} className='mt-2 space-y-5 text-left'>
          {error && (
            <div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
              {error}
            </div>
          )}

          <FormField
            id='name'
            label='이름'
            placeholder='이름을 입력하세요'
            required
            value={form.name}
            onChange={e => handleInputChange('name', e.target.value)}
            autoComplete='name'
          />

          <AddressInput
            id='address'
            label='주소'
            value={form.address}
            onChange={handleAddressChange}
            placeholder='상세주소를 입력하세요'
            variant='signup'
            required
          />

          <FormField id='phone' label='휴대전화' required>
            <div className='flex w-full items-center gap-2'>
              <input
                type='text'
                inputMode='numeric'
                value={form.phone1}
                onChange={e =>
                  handleInputChange('phone1', onlyDigits(e.target.value))
                }
                placeholder='010'
                maxLength={3}
                className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
              />
              <span className='text-gray-500'>-</span>
              <input
                type='text'
                inputMode='numeric'
                value={form.phone2}
                onChange={e =>
                  handleInputChange('phone2', onlyDigits(e.target.value))
                }
                placeholder='1234'
                maxLength={4}
                className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
              />
              <span className='text-gray-500'>-</span>
              <input
                type='text'
                inputMode='numeric'
                value={form.phone3}
                onChange={e =>
                  handleInputChange('phone3', onlyDigits(e.target.value))
                }
                placeholder='5678'
                maxLength={4}
                className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
              />
            </div>
          </FormField>

          <button
            type='submit'
            className={`w-full rounded bg-primary-200 p-3 text-white ${step === 'submitting' ? 'opacity-60' : ''}`}
            disabled={step === 'submitting'}
          >
            {step === 'submitting' ? '처리 중…' : '회원가입 완료'}
          </button>
        </form>
      )}

      {step === 'submitting' && <p className='text-sm text-gray-700'>{msg}</p>}

      {step === 'done' && (
        <div className='rounded border border-green-200 bg-green-50 p-4 text-sm text-green-700'>
          {msg}
        </div>
      )}
    </div>
  );
}
