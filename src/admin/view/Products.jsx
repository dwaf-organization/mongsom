import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import AddProductInfoSection from '../components/section/product/AddProductInfoSection';

export default function Products() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>상품 등록</h2>
      <AddProductInfoSection />
    </InnerPaddingSectionWrapper>
  );
}
