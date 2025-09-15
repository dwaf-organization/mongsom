import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function ExchangeTabSection() {
  const [tab] = useSearchParams();
  const activeTab = tab.get('tab') || 'exchange';

  return (
    <section className='flex flex-col'>
      <div className='flex items-center justify-start'>
        <Link to='/admin/exchange-return?tab=exchange'>
          <p
            className={`px-6 py-2 w-full transition-colors duration-200 ${
              activeTab === 'exchange'
                ? 'text-primary-200 font-semibold border-b-2 border-primary-200'
                : ' hover:bg-primary-150'
            }`}
          >
            교환
          </p>
        </Link>
        <Link to='/admin/exchange-return?tab=return'>
          <p
            className={`px-6 py-2 w-full transition-colors duration-200 ${
              activeTab === 'return'
                ? 'text-primary-200 font-semibold border-b-2 border-primary-200 '
                : ' hover:bg-primary-150'
            }`}
          >
            반품
          </p>
        </Link>
      </div>
      <hr className='w-full border-gray-500' />
    </section>
  );
}
