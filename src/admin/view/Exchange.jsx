import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ExchangeTabSection from '../components/section/exchange/ExchangeTabSection';

export default function Exchange() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>교환/반품</h2>
      <ExchangeTabSection />
    </InnerPaddingSectionWrapper>
  );
}
