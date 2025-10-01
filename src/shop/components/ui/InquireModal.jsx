import { useState } from 'react';
import { PRICE_OPTIONS, CATEGORY_OPTIONS } from '../../constants/inquiry';
import { Button } from './button';
import { useToast } from '../../context/ToastContext';
import { inquire } from '../../api/inquire/index';
import { useModal } from '../../context/ModalContext';

const isEmail = v => /^\S+@\S+\.\S+$/.test(String(v || '').trim());

const digits = v => String(v || '').replace(/\D/g, '');

export default function InquireModal() {
  const { addToast } = useToast();
  const { closeModal } = useModal();

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!selectedCategory) return addToast('카테고리를 선택하세요.', 'error');
    if (!name.trim()) return addToast('이름/회사명을 입력하세요.', 'error');
    if (!isEmail(email))
      return addToast('올바른 이메일을 입력하세요.', 'error');
    if (!digits(phone))
      return addToast(
        '전화번호를 입력하세요. 숫자만 입력 가능합니다.',
        'error',
      );
    if (!message.trim()) return addToast('문의내용을 입력하세요.', 'error');
    if (!selectedPrice) return addToast('희망 가격을 선택하세요.', 'error');

    const price = PRICE_OPTIONS.find(p => p.id === selectedPrice);
    const category = CATEGORY_OPTIONS.find(c => c.id === selectedCategory);
    const payload = {
      // category: selectedCategory,
      category: category?.label ?? '',
      companyName: name.trim(),
      email: email.trim(),
      phone: digits(phone),
      contents: message.trim(),
      price: price?.label ?? '', // ← 여기만 있으면 됨
    };

    try {
      const res = await inquire(payload);
      console.log('🚀 ~ handleSubmit ~ res:', res);

      if (!res.code === 1) {
        const t = await res.text().catch(() => '');
        throw new Error(t || `요청 실패 (${res.status})`);
      }

      addToast('견적 문의가 접수되었습니다.', 'success');
      closeModal();

      setSelectedCategory(null);
      setSelectedPrice(null);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (e) {
      alert(e.message || '문의 접수 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 px-10'>
      <h2 className='py-4 text-center font-montserrat text-4xl font-bold'>
        CONTACT
      </h2>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* 카테고리 */}
        <section className='w-full'>
          <label className='w-full text-lg font-bold'>카테고리</label>
          <div
            className='pt-4 flex w-full flex-wrap items-center gap-3'
            role='radiogroup'
            aria-label='카테고리'
          >
            {CATEGORY_OPTIONS.map(({ id, label, Icon }) => {
              const selected = selectedCategory === id;
              return (
                <button
                  key={id}
                  type='button'
                  role='radio'
                  aria-checked={selected}
                  onClick={() => setSelectedCategory(id)}
                  className={[
                    'flex h-[156px] w-[156px] flex-col items-center justify-center gap-2 rounded-md border-2 transition',
                    selected
                      ? 'border-primary-200 ring-2 ring-primary-200/20'
                      : 'border-gray-300 hover:border-gray-400',
                  ].join(' ')}
                >
                  <Icon />
                  <p className='text-sm'>{label}</p>
                </button>
              );
            })}
          </div>
          <input
            type='hidden'
            name='categoryId'
            value={selectedCategory || ''}
          />
        </section>

        {/* 기본 정보 */}
        <section className='py-4 flex w-full max-w-[800px] flex-col gap-2'>
          <label className='w-full'>
            이름
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='이름,회사명'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>

          <label className='w-full'>
            이메일
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='이메일'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>

          <label className='w-full'>
            전화번호
            <input
              type='tel'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder='전화번호'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>

          <label className='w-full'>
            문의내용
            <input
              type='text'
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder='문의내용'
              className='w-full max-w-[800px] rounded-md border border-gray-300 p-2'
            />
          </label>
        </section>

        {/* 희망 가격 */}
        <section className='flex flex-col pb-5'>
          <h2 className='mb-2 font-semibold'>희망 가격</h2>
          <div
            className='flex flex-wrap gap-2'
            role='radiogroup'
            aria-label='희망 가격'
          >
            {PRICE_OPTIONS.map(opt => {
              const selected = selectedPrice === opt.id;
              return (
                <button
                  key={opt.id}
                  type='button'
                  role='radio'
                  aria-checked={selected}
                  onClick={() => setSelectedPrice(opt.id)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm transition',
                    selected
                      ? 'border-primary-200 bg-primary-200 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <input
            type='hidden'
            name='priceOptionId'
            value={selectedPrice || ''}
          />
        </section>

        {/* 제출 버튼은 폼 안에서 submit으로 */}
        <Button type='submit' className='text-md mb-4 rounded-sm py-3'>
          견적 문의신청하기
        </Button>
      </form>
    </div>
  );
}
