import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import EditProductInfoSection from '../components/section/product/EditProductInfo';

export default function EditProductInfo() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>상품 수정</h2>
      <EditProductInfoSection />
    </InnerPaddingSectionWrapper>
  );
}
