const OrderStatusSelect = ({ value, onChange, name = 'status' }) => {
  return (
    <div className='relative w-48'>
      <select
        name={name}
        className='h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none cursor-pointer transition-colors duration-200'
        onChange={onChange}
        value={value}
      >
        <option value='' className='text-gray-500'>
          전체
        </option>
        <option value='결제대기'>결제 대기</option>
        <option value='결제완료'>결제 완료</option>
        <option value='상품준비중'>상품준비중</option>
        <option value='배송중'>배송중</option>
        <option value='배송완료'>배송완료</option>
        <option value='예약배송'>예약배송</option>
        <option value='재고부족'>재고부족</option>
        <option value='입고지연'>입고지연</option>
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );
};

export default OrderStatusSelect;
