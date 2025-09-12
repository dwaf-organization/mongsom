import { sortOptions } from '../../../constants/orderSortOptions';
import SearchForm from '../../ui/SearchForm';
import Select from '../../ui/Select';

export default function OrderSearchSection({ onSearch }) {
  const handleSubmit = data => {
    console.log('Search data:', data);
    onSearch?.(data);
  };

  return (
    <SearchForm onSubmit={handleSubmit} submitButtonText='조회'>
      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b '>
          기간
        </div>

        <div className='p-4 border-b flex flex-wrap items-center gap-3'>
          <label className='sr-only' htmlFor='base'>
            기준
          </label>
          <Select options={sortOptions} value='order' />

          <input
            type='date'
            name='periodFrom'
            className='h-10 w-28 rounded-md border px-3 text-sm text-center focus:outline-none focus:ring focus:ring-gray-300'
            defaultValue='2025-01-01'
          />
          <span className='text-gray-400'>–</span>
          <input
            type='date'
            name='periodTo'
            className='h-10 w-28 rounded-md border px-3 text-sm text-center focus:outline-none focus:ring focus:ring-gray-300'
            defaultValue='2025-01-01'
          />
        </div>
      </div>

      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4'>
          주문번호
        </div>

        <input
          type='text'
          name='orderNumber'
          placeholder='주문번호를 입력하세요'
          className='h-10 rounded-md border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring focus:ring-gray-300 m-4'
        />
      </div>
    </SearchForm>
  );
}
