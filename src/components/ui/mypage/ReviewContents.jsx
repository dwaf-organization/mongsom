export default function ReviewContents() {
  return (
    <section className='flex items-start justify-between py-10 gap-4 border-b border-gray-400'>
      <p className='font-semibold text-left pb-4 whitespace-nowrap '>
        상세 리뷰
      </p>
      <textarea
        className='w-full ml-[100px] h-[200px] border border-gray-400 rounded-lg p-4 resize-none '
        placeholder='리뷰를 작성해주세요.'
      />
    </section>
  );
}
