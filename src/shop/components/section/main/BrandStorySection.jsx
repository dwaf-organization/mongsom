import ColorSectionWrapper from '../../../wrapper/ColorSectionWrapper';
import MoreButton from '../../../layout/button/MoreButton';
import brandStory from '../../../asset/image/brandStoryImg.png';

export default function BrandStorySection() {
  return (
    <div className='flex flex-col items-center justify-center relative'>
      <img src={brandStory} alt='brandStory' className='relative' />
      <p className='absolute top-12 md:top-40 left-1/2 -translate-x-1/2 md:text-4xl font-montserrat font-bold text-white pb-8'>
        Brand Story
      </p>
      <p className='absolute left-1/2 -translate-x-1/2 md:text-2xl font-pretendard font-bold text-white pb-8'>
        몽솜이야기
      </p>
      <MoreButton />
    </div>
  );
}
