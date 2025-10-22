export default function ReviewContents({ value, onChange }) {
  return (
    <section className=' border-b border-gray-400 py-10'>
      <div className='flex items-start justify-between gap-4'>
        <p className='font-semibold text-left pb-4 whitespace-nowrap '>
          상세 리뷰
        </p>
        <textarea
          className='w-full h-[200px] border border-gray-400 rounded-lg p-4 resize-none '
          placeholder='리뷰를 작성해주세요.'
          maxLength={200}
          value={value}
          onChange={e => onChange?.(e.target.value)}
        />
      </div>
      <p className='text-xs text-gray-700 text-right pt-2'>
        *최대 200자까지 등록 가능합니다.{' '}
      </p>
    </section>
  );
}
