import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import SearchForm from '../../ui/SearchForm';

export default function ProductSearchSection({ onSearch, defaultValues }) {
  const [form, setForm] = useState({
    name: defaultValues?.name || '',
    premium: Number.isFinite(defaultValues?.premium)
      ? defaultValues.premium
      : 2,
  });

  useEffect(() => {
    if (!defaultValues) return;
    setForm({
      name: defaultValues.name || '',
      premium: Number.isFinite(defaultValues.premium)
        ? defaultValues.premium
        : 2,
    });
  }, [defaultValues]);

  const handleSubmit = () => {
    onSearch?.(form);
  };

  const setPremium = val => {
    setForm(prev => ({ ...prev, premium: val }));
  };

  return (
    <SearchForm onSubmit={handleSubmit} submitButtonText='조회'>
      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품명
        </div>

        <div className='p-4 border-b flex flex-wrap items-center gap-3'>
          <input
            placeholder='상품명을 입력하세요'
            name='name'
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className='w-full border rounded-md p-2 focus:outline-primary-200 border-gray-400'
          />
        </div>
      </div>

      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품 분류
        </div>

        <div className='p-4 flex items-center gap-2'>
          <Button
            type='button'
            variant={form.premium === 2 ? 'default' : 'outline'}
            className={
              form.premium === 2
                ? 'text-white'
                : 'border-gray-500 text-gray-600'
            }
            onClick={() => setPremium(2)}
          >
            전체 상품
          </Button>
          <Button
            type='button'
            variant={form.premium === 1 ? 'default' : 'outline'}
            className={
              form.premium === 1
                ? 'text-white'
                : 'border-gray-500 text-gray-600'
            }
            onClick={() => setPremium(1)}
          >
            프리미엄 선물용
          </Button>
          <Button
            type='button'
            variant={form.premium === 0 ? 'default' : 'outline'}
            className={
              form.premium === 0
                ? 'text-white'
                : 'border-gray-500 text-gray-600'
            }
            onClick={() => setPremium(0)}
          >
            일반 상품
          </Button>
        </div>
      </div>
    </SearchForm>
  );
}
