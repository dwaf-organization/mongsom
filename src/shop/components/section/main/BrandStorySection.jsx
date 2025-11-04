import ColorSectionWrapper from '../../../wrapper/ColorSectionWrapper';
import MoreButton from '../../../layout/button/MoreButton';
import brandStory from '../../../asset/image/brandStoryImg.png';

export default function BrandStorySection() {
  return (
    <section className='flex flex-col items-center justify-center relative'>
      <img src={brandStory} alt='brandStory' className='relative' />
      <p className='absolute top-8 md:top-20  xl:top-40 left-1/2 -translate-x-1/2 text-lg md:text-4xl font-montserrat font-bold text-white pb-8'>
        Brand Story
      </p>
      <p className='absolute bottom-4 md:bottom-20 xl:bottom-32 left-1/2 -translate-x-1/2 text-sm md:text-2xl font-pretendard font-semibold text-white pb-8'>
        몽솜의 이야기
      </p>
      <MoreButton />
    </section>
  );
}
