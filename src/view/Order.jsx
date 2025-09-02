import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import BreadCrumbSection from '../components/section/cart/BreadCrumbSection';

export default function Order() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-pretendard pb-5'>주문/결제</h2>
      <BreadCrumbSection />
    </InnerPaddingSectionWrapper>
  );
}
