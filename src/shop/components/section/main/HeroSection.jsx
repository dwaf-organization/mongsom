import NextChevron from '../../../asset/icons/NextChevron';

export default function HeroSection() {
  return (
    <section className='w-full h-full flex flex-col items-center justify-center bg-black-100 relative min-h-[600px]'>
      <div className='text-center space-y-6'>
        <p className='text-primary-100 text-xl mb-8'>배너 이미지</p>
        <div className='bg-primary-100/60 flex justify-between items-center gap-2 text-black-100 px-8 py-2 rounded-full text-xl'>
          <p className='font-semibold'> 견적 · 대량구매 문의</p>
          <NextChevron />
        </div>
      </div>
    </section>
  );
}
