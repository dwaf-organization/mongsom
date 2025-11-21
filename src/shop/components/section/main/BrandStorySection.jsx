import MoreButton from '../../../layout/button/MoreButton';
import brandStory from '../../../asset/image/brandStoryImg.jpg';

export default function BrandStorySection() {
  return (
    <section className='flex flex-col items-center justify-center relative'>
      <div
        backgroundImg={brandStory}
        className='relative w-full h-[180px] md:h-[300px] xl:h-[400px] overflow-hidden bg-center bg-cover'
        style={{
          backgroundImage: `url(${brandStory})`,
          filter: 'brightness(0.95)',
        }}
      >
        <p className='absolute inset-0 top-1/3 left-1/2 -translate-x-1/2 text-center text-lg md:text-4xl font-montserrat font-bold text-black-100 pb-8 text-center'>
          Brand Story
        </p>
        <p className='absolute inset-0 text-center top-1/2 left-1/2 -translate-x-1/2 text-sm md:text-3xl font-pretendard font-semibold text-black-100 pb-8'>
          몽솜의 이야기
        </p>
      </div>
      <MoreButton />
    </section>
  );
}
