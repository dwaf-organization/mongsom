import { Button } from '../../ui/button';
import SearchForm from '../../ui/SearchForm';
import Select from '../../ui/Select';

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'active', label: '판매중' },
  { value: 'inactive', label: '판매중지' },
  { value: 'soldout', label: '품절' },
];

export default function ProductSearchSection({ onSearch }) {
  const handleSubmit = data => {
    console.log('Product search data:', data);
    onSearch?.(data);
  };

  return (
    <SearchForm onSubmit={handleSubmit} submitButtonText='조회'>
      <di className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품명
        </div>

        <div className='p-4 border-b flex flex-wrap items-center gap-3'>
          <input
            placeholder='상품명을 입력하세요'
            name='productName'
            className='w-full border rounded-md p-2 focus:outline-primary-200 border-gray-400'
          />
        </div>
      </di>

      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품 분류
        </div>

        <div className='p-4 flex items-center gap-3'>
          <Button
            variant='outline'
            className='border-gray-500 text-gray-500 w-fit'
          >
            프리미엄 선물용
          </Button>
          <Button
            variant='outline'
            className='border-gray-500 text-gray-500 w-fit'
          >
            일반 상품
          </Button>
        </div>
      </div>
    </SearchForm>
  );
}
