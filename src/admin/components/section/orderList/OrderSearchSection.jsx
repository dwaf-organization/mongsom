import SearchForm from '../../ui/SearchForm';
import { useMemo, useState, useEffect } from 'react';

// 로컬 타임존 안전 YYYY-MM-DD
const toISODate = d =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

// 오늘 기준 정확히 한 달 전(말일 보정)
const oneMonthAgoISO = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth(); // 0-based
  const day = today.getDate();
  const lastPrev = new Date(y, m, 0).getDate();
  const targetDay = Math.min(day, lastPrev);
  return toISODate(new Date(y, m - 1, targetDay));
};

// 상위가 준 값이 “형식상 기본값(오늘/오늘/빈 주문번호)”인지 판별
const isTrivialDefault = (vals, today) => {
  if (!vals) return true;
  const sameAsToday =
    vals.startDate === today &&
    vals.endDate === today &&
    (vals.orderId ?? '') === '';
  return !!sameAsToday;
};

export default function OrderSearchSection({ onSearch, defaultValues }) {
  const today = useMemo(() => toISODate(new Date()), []);
  const monthAgo = useMemo(() => oneMonthAgoISO(), []);

  // 초기 상태: 상위 기본값이 “진짜 값”이면 반영, 아니면 한달전/오늘
  const [input, setInput] = useState(() => {
    const useParent = defaultValues && !isTrivialDefault(defaultValues, today);
    return {
      startDate: useParent ? defaultValues.startDate : monthAgo,
      endDate: useParent ? defaultValues.endDate : today,
      orderId: useParent ? (defaultValues.orderId ?? '') : '',
    };
  });

  // 이후 상위 값이 바뀌면, “형식상 기본값”이 아닐 때만 반영
  useEffect(() => {
    if (!defaultValues) return;
    if (isTrivialDefault(defaultValues, today)) return; // 오늘/오늘/빈문자면 무시
    setInput(prev => ({
      startDate:
        defaultValues.startDate != null
          ? defaultValues.startDate
          : prev.startDate,
      endDate:
        defaultValues.endDate != null ? defaultValues.endDate : prev.endDate,
      orderId:
        defaultValues.orderId != null ? defaultValues.orderId : prev.orderId,
    }));
  }, [defaultValues, today]);

  const handleSubmit = () => {
    if (input.startDate > input.endDate) return;
    onSearch?.({ ...input, orderId: input.orderId.trim() });
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

  return (
    <SearchForm onSubmit={handleSubmit} submitButtonText='조회'>
      <div className='grid grid-cols-[120px_1fr]'>
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
        </div>
      </div>

      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4'>
          주문번호
        </div>

        <input
          type='text'
          name='orderId'
          placeholder='주문번호를 입력하세요'
          className='h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200 m-4'
          onChange={inputChange}
          value={input.orderId}
        />
      </div>
    </SearchForm>
  );
}
