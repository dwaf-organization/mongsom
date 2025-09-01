import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/Cart/BreadCrumbSection';

export default function Cart() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-pretendard'>장바구니</h2>

      <BreadCrumbSection />
    </InnerPaddingSectionWrapper>
  );
}
