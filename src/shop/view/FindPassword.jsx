import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { findPassword } from '../api/login';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function FindPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    userId: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFindPassword = async e => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      name: form.name,
      userId: form.userId,
      email: form.email,
      phone: form.phone,
    };

    if (
      payload.name === '' ||
      payload.userId === '' ||
      payload.email === '' ||
      payload.phone === ''
    ) {
      addToast('모든 필드를 입력해주세요.', 'error');
      return;
    }

    try {
      setLoading(true);
      console.log('[FindPassword] 요청 payload:', payload);
      const response = await findPassword(payload);
      console.log('[FindPassword] 응답:', response);
      if (response.code === -1) {
        addToast(response.data, 'error');
        return;
      }
      if (response.code === 1) {
        addToast('비밀번호 찾기 이메일이 발송되었습니다.', 'success');
        navigate('/password-reset-complete');
        return;
      }
    } catch (err) {
      console.error('[FindPassword] 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <InnerPaddingSectionWrapper className='max-w-[500px]'>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-400 max-w-[500px] w-full pb-4'>
        비밀번호 찾기
      </h2>

      <div className='flex flex-col items-center justify-center gap-4 pt-10'>
        <form
          className='flex flex-col items-center justify-center gap-4 w-full max-w-[400px]'
          onSubmit={handleFindPassword}
        >
          <input
            type='text'
            placeholder='이름'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={form.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          <input
            type='text'
            placeholder='아이디'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={form.userId}
            onChange={e => handleInputChange('userId', e.target.value)}
          />

          <input
            type='text'
            placeholder='전화번호'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={form.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
          />

          <input
            type='email'
            placeholder='이메일'
            className='border border-gray-400 rounded-md p-3 w-full focus:outline-primary-200'
            value={form.email}
            onChange={e => handleInputChange('email', e.target.value)}
          />

          <Button type='submit' className='w-full py-3' disabled={loading}>
            {loading ? '처리 중…' : '비밀번호 찾기'}
          </Button>
        </form>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
