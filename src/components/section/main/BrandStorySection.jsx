import ColorSectionWrapper from '../../../wrapper/ColorSectionWrapper';
import MoreButton from '../../../layout/button/MoreButton';

export default function BrandStorySection() {
  return (
    <ColorSectionWrapper>
      <div className='flex flex-col items-center justify-center'>
        <h2 className='font-montserrat text-4xl font-bold pb-8'>Brand Story</h2>

        <p className='font-pretendard text-lg pb-8'>몽솜 브랜드 스토리 내용</p>
        <MoreButton />
      </div>
    </ColorSectionWrapper>
  );
}
