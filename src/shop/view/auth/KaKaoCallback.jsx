import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AddressInput from '../../components/ui/AddressInput';
import FormField from '../../components/ui/SignUp/FormField';
import AgreeModal from '../../components/ui/AgreeModal';
import { useModal } from '../../context/ModalContext';

import { signUp } from '../../api/signUp';
import { kakaoLoginCheck } from '../../api/login';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

function formEncode(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
    .join('&');
}

function extractName(profile) {
  return (
    profile?.kakao_account?.profile?.nickname ||
    profile?.properties?.nickname ||
    profile?.kakao_account?.name ||
    ''
  );
}

function extractEmail(profile) {
  return profile?.kakao_account?.email || '';
}

const onlyDigits = v => (v || '').replace(/\D/g, '');

export default function KakaoCallback() {
  const { openModal } = useModal();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState('loading');
  const [msg, setMsg] = useState('카카오 로그인 처리 중…');
  const [error, setError] = useState(null);

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: { zipCode: '', address: '', address2: '' },
    phone1: '',
    phone2: '',
    phone3: '',
    agreeMain: false,
    agreeShopping: false,
    agreeSms: false,
    agreeEmail: false,
  });

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleAddressChange = addressData => {
    setForm(prev => ({ ...prev, address: addressData }));
  };
  const handleToggleAgree = field => {
    setForm(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClick = () => {
    openModal(<AgreeModal />);
  };

  const once = useRef(false);
  const code = useMemo(() => sp.get('code') || '', [sp]);
  const state = useMemo(() => sp.get('state') || '', [sp]);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const run = async () => {
      try {
        if (!code) {
          setError('code 없음');
          setStep('error');
          return;
        }
        const storedState = sessionStorage.getItem('kakao_oauth_state');
        if (storedState && state && storedState !== state) {
          console.warn(
            'state 불일치. 개발 중에는 넘어가도 되지만 정식에선 막아라.',
          );
        }

        setMsg('토큰 교환 중…');
        const clientId = process.env.REACT_APP_REST_API_KEY;
        const redirectUri = `${window.location.origin}/auth/kakao/callback`;
        const body = formEncode({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
        });

        const tokenResp = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body,
        });
        if (!tokenResp.ok) {
          const errText = await tokenResp.text().catch(() => '');
          throw new Error(`토큰 교환 실패 (${tokenResp.status}) ${errText}`);
        }
        const tokenJson = await tokenResp.json();
        setToken(tokenJson);

        setMsg('프로필 조회 중…');
        const meResp = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${tokenJson.access_token}` },
        });
        if (!meResp.ok) {
          const t = await meResp.text().catch(() => '');
          throw new Error(`프로필 조회 실패 (${meResp.status}) ${t}`);
        }
        const meJson = await meResp.json();
        setProfile(meJson);

        const nickname = extractName(meJson) || '카카오사용자';
        const emailFromKakao = extractEmail(meJson) || '';

        setForm(prev => ({ ...prev, name: nickname, email: emailFromKakao }));

        setMsg('회원 여부 확인 중…');

        let checkResp;
        try {
          checkResp = await kakaoLoginCheck({
            email: emailFromKakao || '',
            nickname,
          });
        } catch (e) {
          console.warn('kakaoLoginCheck 실패, 폼으로 진행:', e);
          checkResp = { code: -1 };
        }

        if (checkResp?.code === 1) {
          const userCode = checkResp?.data;
          login({ userData: { userId: String(meJson?.id || '') }, userCode });
          addToast('카카오 로그인 완료', 'success');
          navigate('/', { replace: true });
          return;
        }

        setStep('form');
        setMsg('추가 정보를 입력하세요.');
      } catch (e) {
        console.error(e);
        setError(e.message || '카카오 처리 실패');
        setStep('error');
      } finally {
        sessionStorage.removeItem('kakao_oauth_state');
      }
    };

    run();
  }, [code, state, addToast, login, navigate]);

  const onSubmit = async e => {
    e.preventDefault();
    if (step === 'submitting') return;

    // 필수값 체크
    if (!form.name.trim()) {
      addToast('이름을 입력하세요.', 'error');
      setStep('form');
      return;
    }
    if (!form.email.trim()) {
      addToast('이메일을 입력하세요.', 'error');
      setStep('form');
      return;
    }
    if (!form.address?.zipCode?.trim() || !form.address?.address?.trim()) {
      addToast('우편번호와 기본주소를 입력하세요.', 'error');
      setStep('form');
      return;
    }
    if (!form.phone1?.trim() || !form.phone2?.trim() || !form.phone3?.trim()) {
      addToast('휴대전화를 입력하세요.', 'error');
      setStep('form');
      return;
    }

    if (!form.agreeMain || !form.agreeShopping) {
      addToast('필수 약관에 동의해야 회원가입이 가능합니다.', 'error');
      setStep('form');
      return;
    }

    try {
      setError(null);
      setStep('submitting');
      setMsg('제출 중…');

      const emailToUse = form.email.trim();

      const payload = {
        provider: 'KAKAO',
        userId: emailToUse,
        email: emailToUse,
        password: '12345678',
        name: form.name.trim(),
        phone: [form.phone1, form.phone2, form.phone3].join(''),
        zipCode: form.address.zipCode.trim(),
        address: form.address.address.trim(),
        address2: (form.address.address2 || '').trim(),
        agreeMain: form.agreeMain,
        agreeShopping: form.agreeShopping,
        agreeSms: form.agreeSms,
        agreeEmail: form.agreeEmail,
      };

      const resp = await signUp(payload);

      if (resp?.code === 1) {
        const userCode = resp?.data;
        if (!userCode) {
          addToast('회원가입은 성공했지만 userCode가 없습니다.', 'error');
        } else {
          login({ userData: { userId: payload.userId }, userCode });
          addToast('회원가입 및 로그인 완료', 'success');
        }
        navigate('/', { replace: true });
      } else {
        addToast(resp?.message || '회원가입에 실패했습니다.', 'error');
        setStep('form');
      }
    } catch (e) {
      console.error(e);
      setError(e.message || '제출 실패');
      setStep('form');
    }
  };

  return (
    <div className='mx-auto max-w-[980px] p-6'>
      <h2 className='mb-2 w-full border-b-2 border-gray-400 pb-4 text-2xl font-bold'>
        카카오 로그인
      </h2>

      {step === 'loading' && <p className='text-sm text-gray-600'>{msg}</p>}

      {step === 'error' && (
        <div className='rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
          {error || '처리 중 오류가 발생했습니다.'}
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={onSubmit} className='mt-4 space-y-5 pt-6'>
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

          <FormField
            id='email'
            label='이메일'
            placeholder='이메일을 입력하세요'
            required
            value={form.email}
            onChange={e => handleInputChange('email', e.target.value)}
            autoComplete='email'
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
                autoComplete='tel-local-prefix'
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
                autoComplete='tel-local-suffix'
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
                autoComplete='tel-local-suffix'
                className='flex-1 rounded-md border border-gray-400 p-2 focus:outline-primary-200'
              />
            </div>
          </FormField>

          <section className='mt-6 space-y-3 rounded-md border border-gray-200 p-4'>
            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.agreeMain}
                onChange={() => handleToggleAgree('agreeMain')}
              />
              <span>
                이용 약관 동의 <span className='text-red-500'>(필수)</span>
              </span>

              <button
                type='button'
                className='ml-auto text-xs text-gray-500 underline'
                onClick={handleClick}
              >
                약관 보기
              </button>
            </label>

            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.agreeShopping}
                onChange={() => handleToggleAgree('agreeShopping')}
              />
              <span>
                개인정보 수집 및 이용 동의{' '}
                <span className='text-red-500'>(필수)</span>
              </span>
            </label>

            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.agreeSms}
                onChange={() => handleToggleAgree('agreeSms')}
              />
              <span>SMS 수신 동의</span>
            </label>

            <label className='flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={form.agreeEmail}
                onChange={() => handleToggleAgree('agreeEmail')}
              />
              <span>이메일 수신 동의</span>
            </label>
          </section>

          <button
            type='submit'
            className={`w-full rounded bg-primary-200 p-3 text-white ${step === 'submitting' ? 'opacity-60' : ''}`}
            disabled={step === 'submitting'}
          >
            {step === 'submitting' ? '제출 중…' : '완료'}
          </button>
        </form>
      )}

      {step === 'submitting' && <p className='text-sm text-gray-600'>{msg}</p>}

      {step === 'done' && (
        <div className='rounded border border-green-200 bg-green-50 p-4 text-sm text-green-700'>
          {msg}
        </div>
      )}
    </div>
  );
}
