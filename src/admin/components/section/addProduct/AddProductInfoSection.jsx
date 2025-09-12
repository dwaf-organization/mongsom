import SearchForm from '../../ui/SearchForm';

export default function AddProductInfoSection() {
  return (
    <>
      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품명
        </div>

        <div className='p-4 border-b flex flex-wrap items-center gap-3'>
          <input placeholder='상품명을 입력하세요' name='category' />
        </div>
      </div>

      <div className='grid grid-cols-[120px_1fr]'>
        <div className='bg-primary-100 text-gray-900 font-semibold px-6 py-4 border-b'>
          상품 분류
        </div>
      </div>
    </>
  );
}
