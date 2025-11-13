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
    (vals.orderId ?? '') === '' &&
    (vals.invoiceNum ?? '') === '' &&
    (vals.receivedUserPhone ?? '') === '' &&
    (vals.receivedUserName ?? '') === '' &&
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
      orderId: useParent ? (defaultValues.orderId ?? '') : '',
      invoiceNum: useParent ? (defaultValues.invoiceNum ?? '') : '',
      receivedUserPhone: useParent
        ? (defaultValues.receivedUserPhone ?? '')
        : '',
      receivedUserName: useParent ? (defaultValues.receivedUserName ?? '') : '',
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
      orderId:
        defaultValues.orderId != null ? defaultValues.orderId : prev.orderId,
      invoiceNum:
        defaultValues.invoiceNum != null
          ? defaultValues.invoiceNum
          : prev.invoiceNum,
      receivedUserPhone:
        defaultValues.receivedUserPhone != null
          ? defaultValues.receivedUserPhone
          : prev.receivedUserPhone,
      receivedUserName:
        defaultValues.receivedUserName != null
          ? defaultValues.receivedUserName
          : prev.receivedUserName,
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
      orderId: input.orderId.trim(),
      invoiceNum: input.invoiceNum.trim(),
      receivedUserPhone: input.receivedUserPhone.trim(),
      receivedUserName: input.receivedUserName.trim(),
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
          검색
        </div>

        <div className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label
                htmlFor='orderId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                주문번호
              </label>
              <input
                id='orderId'
                type='text'
                name='orderId'
                placeholder='주문번호를 입력하세요'
                className='w-full h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200'
                onChange={inputChange}
                value={input.orderId}
              />
            </div>

            <div>
              <label
                htmlFor='invoiceNum'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                송장번호
              </label>
              <input
                id='invoiceNum'
                type='text'
                name='invoiceNum'
                placeholder='송장번호를 입력하세요'
                className='w-full h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200'
                onChange={inputChange}
                value={input.invoiceNum}
              />
            </div>

            <div>
              <label
                htmlFor='receivedUserPhone'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                전화번호
              </label>
              <input
                id='receivedUserPhone'
                type='text'
                name='receivedUserPhone'
                placeholder='전화번호를 입력하세요'
                className='w-full h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200'
                onChange={inputChange}
                value={input.receivedUserPhone}
              />
            </div>

            <div>
              <label
                htmlFor='receivedUserName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                이름
              </label>
              <input
                id='receivedUserName'
                type='text'
                name='receivedUserName'
                placeholder='이름을 입력하세요'
                className='w-full h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-primary-200'
                onChange={inputChange}
                value={input.receivedUserName}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-[120px_1fr] border-t'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4'>
          필터링
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
