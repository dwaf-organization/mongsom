import { useEffect, useState } from 'react';
import FormField from '../SignUp/FormField';
import AddressInput from '../AddressInput';
import { Button } from '../button';
import { updateMyInfo } from '../../../api/myPage';
import { toFormState, toApiPayload } from '../../../utils/formUtils';
import { onlyDigits } from '../../../utils/phoneUtils';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function MyInfoForm({ userData }) {
  const { addToast } = useToast();
  const { userCode } = useAuth();

  const [userInfo, setUserInfo] = useState(() =>
    toFormState(userData, userCode),
  );

  // 컴포넌트 함수 내부 맨 위쪽 어딘가에 추가
  const formatMobilePhone = digits => {
    // 11자리까지만 사용 (010 기준)
    const d = digits.slice(0, 11);
    const p1 = d.slice(0, 3);
    const p2 = d.slice(3, 7);
    const p3 = d.slice(7, 11);

    if (!p1) return '';
    if (!p2) return p1;
    if (!p3) return `${p1}-${p2}`;
    return `${p1}-${p2}-${p3}`;
  };

  const handlePhoneUnifiedChange = raw => {
    const d = onlyDigits(raw).slice(0, 11); // 숫자만, 최대 11
    setUserInfo(prev => ({
      ...prev,
      phone1: d.slice(0, 3),
      phone2: d.slice(3, 7),
      phone3: d.slice(7, 11),
    }));
  };

  const unifiedPhoneValue = formatMobilePhone(
    `${userInfo.phone1 ?? ''}${userInfo.phone2 ?? ''}${userInfo.phone3 ?? ''}`,
  );

  useEffect(() => {
    setUserInfo(toFormState(userData, userCode));
  }, [userData, userCode]);

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = addr => {
    setUserInfo(prev => ({ ...prev, address: addr }));
  };

  const handleSave = async e => {
    e.preventDefault();

    if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
      addToast('새 비밀번호가 확인 값과 일치하지 않습니다.', 'error');
      return;
    }

    const includePassword = Boolean(userInfo.password);
    const payload = toApiPayload(userInfo, includePassword);

    const res = await updateMyInfo(payload);
    console.log('🚀 ~ handleSave ~ res:', res);
    if (res?.code === 1) {
      addToast('정보 수정이 완료되었습니다.', 'success');
    } else {
      addToast(res?.data || '정보 수정에 실패했습니다.', 'error');
    }
  };

  return (
    <div>
      <section className='flex flex-col justify-center py-6 space-y-6'>
        <form
          className='flex flex-col justify-center py-6 space-y-6'
          onSubmit={handleSave}
        >
          <FormField
            id='userId'
            label='아이디'
            placeholder='아이디를 입력하세요'
            required
            message='(영문 소문자/숫자 , 4~16자)'
            value={userInfo.userId}
            readOnly
            className='focus:outline-none'
          />

          <FormField
            id='password'
            label='비밀번호'
            type='password'
            placeholder='새비밀번호'
            value={userInfo.password}
            onChange={e => handleInputChange('password', e.target.value)}
          />

          <FormField
            id='confirmPassword'
            label='비밀번호 확인'
            type='password'
            placeholder='새비밀번호 확인'
            value={userInfo.confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
          />

          <FormField
            id='name'
            label='이름'
            placeholder='이름을 입력하세요'
            required
            readOnly
            value={userInfo.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />

          <FormField id='phone' label='휴대전화'>
            <input
              type='tel'
              inputMode='numeric'
              placeholder='010-1234-5678'
              value={unifiedPhoneValue}
              onChange={e => handlePhoneUnifiedChange(e.target.value)}
              className='border rounded-md p-3 w-full focus:outline-primary-200 border-gray-400 md:hidden'
              maxLength={13}
            />

            <div className='hidden md:flex items-center gap-2 w-full'>
              <input
                type='text'
                value={userInfo.phone1}
                className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
                onChange={e =>
                  handleInputChange(
                    'phone1',
                    onlyDigits(e.target.value).slice(0, 3),
                  )
                }
                maxLength={3}
                inputMode='numeric'
              />
              <span className='text-gray-500'>-</span>
              <input
                type='text'
                value={userInfo.phone2}
                className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
                onChange={e =>
                  handleInputChange(
                    'phone2',
                    onlyDigits(e.target.value).slice(0, 4),
                  )
                }
                maxLength={4}
                inputMode='numeric'
              />
              <span className='text-gray-500'>-</span>
              <input
                type='text'
                value={userInfo.phone3}
                className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
                onChange={e =>
                  handleInputChange(
                    'phone3',
                    onlyDigits(e.target.value).slice(0, 4),
                  )
                }
                maxLength={4}
                inputMode='numeric'
              />
            </div>
          </FormField>
          <AddressInput
            id='address'
            label='주소'
            value={userInfo.address}
            variant='signup'
            onChange={handleAddressChange}
          />

          <FormField id='email' label='이메일'>
            <input
              type='email'
              value={userInfo.email}
              className='border rounded-md p-3 flex-1 focus:outline-primary-200 border-gray-400'
              onChange={e => handleInputChange('email', e.target.value)}
            />
          </FormField>

          <div className='flex justify-center'>
            <Button
              type='submit'
              className='w-fit px-8 py-2 mt-11 mx-auto text-lg rounded-none'
            >
              정보 수정
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
