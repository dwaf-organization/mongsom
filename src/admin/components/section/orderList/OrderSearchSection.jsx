import SearchForm from '../../ui/SearchForm';
import OrderStatusSelect from '../../ui/OrderStatusSelect';
import { useMemo, useState, useEffect } from 'react';

const toISODate = d =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

const oneMonthAgoISO = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth(); // 0-based
  const day = today.getDate();
  const lastPrev = new Date(y, m, 0).getDate();
  const targetDay = Math.min(day, lastPrev);
  return toISODate(new Date(y, m - 1, targetDay));
};

const isTrivialDefault = (vals, today) => {
  if (!vals) return true;
  const sameAsToday =
    vals.startDate === today &&
    vals.endDate === today &&
    vals.searchKeyword === '' &&
    (vals.deliveryStatus ?? '') === '';
  return !!sameAsToday;
};

export default function OrderSearchSection({ onSearch, defaultValues }) {
  const today = useMemo(() => toISODate(new Date()), []);
  const monthAgo = useMemo(() => oneMonthAgoISO(), []);

  const [input, setInput] = useState(() => {
    const useParent = defaultValues && !isTrivialDefault(defaultValues, today);
    return {
      startDate: useParent ? defaultValues.startDate : monthAgo,
      endDate: useParent ? defaultValues.endDate : today,
      searchKeyword: useParent ? (defaultValues.searchKeyword ?? '') : '',
      deliveryStatus: useParent ? (defaultValues.deliveryStatus ?? '') : '',
    };
  });

  useEffect(() => {
    if (!defaultValues) return;
    if (isTrivialDefault(defaultValues, today)) return;
    setInput(prev => ({
      startDate:
        defaultValues.startDate != null
          ? defaultValues.startDate
          : prev.startDate,
      endDate:
        defaultValues.endDate != null ? defaultValues.endDate : prev.endDate,
      searchKeyword:
        defaultValues.searchKeyword != null
          ? defaultValues.searchKeyword
          : prev.searchKeyword,
      deliveryStatus:
        defaultValues.deliveryStatus != null
          ? defaultValues.deliveryStatus
          : prev.deliveryStatus,
    }));
  }, [defaultValues, today]);

  const handleSubmit = () => {
    if (input.startDate > input.endDate) return;
    onSearch?.({
      ...input,
      searchKeyword: input.searchKeyword.trim(),
    });
  };

  const inputChange = e => {
    const { name, value } = e.target;
    setInput(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'startDate' && next.startDate > next.endDate) {
        next.endDate = next.startDate;
      }
      return next;
    });
  };

  const handlePeriodClick = days => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setInput(prev => ({
      ...prev,
      startDate: toISODate(start),
      endDate: toISODate(end),
    }));
  };

  return (
    <SearchForm onSubmit={handleSubmit} submitButtonText='조회'>
      <div className='grid grid-cols-[120px_1fr] text-center'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          기간
        </div>

        <div className='p-4 border-b flex flex-wrap items-center gap-3'>
          <label className='sr-only' htmlFor='startDate'>
            시작일
          </label>
          <input
            id='startDate'
            type='date'
            name='startDate'
            className='h-10 w-32 rounded-md border px-3 text-sm text-center focus:outline-none focus:ring focus:ring-gray-300'
            value={input.startDate}
            onChange={inputChange}
            max={input.endDate}
          />
          <span className='text-gray-400'>–</span>
          <label className='sr-only' htmlFor='endDate'>
            종료일
          </label>
          <input
            id='endDate'
            type='date'
            name='endDate'
            className='h-10 w-32 rounded-md border px-3 text-sm text-center focus:outline-none focus:ring focus:ring-gray-300'
            value={input.endDate}
            onChange={inputChange}
            min={input.startDate}
          />
          <button
            type='button'
            className='h-10 px-4 rounded-md border text-sm hover:bg-gray-100'
            onClick={() => handlePeriodClick(1)}
          >
            1일
          </button>
          <button
            type='button'
            className='h-10 px-4 rounded-md border text-sm hover:bg-gray-100'
            onClick={() => handlePeriodClick(7)}
          >
            7일
          </button>
          <button
            type='button'
            className='h-10 px-4 rounded-md border text-sm hover:bg-gray-100'
            onClick={() => handlePeriodClick(30)}
          >
            30일
          </button>
        </div>
      </div>

      <div className='grid grid-cols-[120px_1fr] text-center'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4'>
          검색
        </div>

        <div className='p-4'>
          <label
            htmlFor='searchKeyword'
            className='block text-sm font-medium text-gray-700 mb-1'
          ></label>
          <input
            id='searchKeyword'
            type='text'
            name='searchKeyword'
            placeholder='주문번호/ 송장번호/전화번호/이름으로 검색'
            className='w-full h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200'
            onChange={inputChange}
            value={input.searchKeyword}
          />
        </div>
      </div>
      <div className='grid grid-cols-[120px_1fr] border-t text-center'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4'>
          주문상태
        </div>

        <div className='p-4'>
          <OrderStatusSelect
            value={input.deliveryStatus}
            onChange={inputChange}
            name='deliveryStatus'
          />
        </div>
      </div>
    </SearchForm>
  );
}
