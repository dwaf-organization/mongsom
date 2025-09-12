import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ProductSearchSection from '../components/section/productList/ProductSearchSection';
import ProductTableSection from '../components/section/productList/ProductTableSection';

export default function ProductList() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>상품 목록</h2>
      <ProductSearchSection />
      <ProductTableSection />
    </InnerPaddingSectionWrapper>
  );
}
