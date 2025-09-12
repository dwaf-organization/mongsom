import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function ExchangeTabSection() {
  const [tab] = useSearchParams();
  const activeTab = tab.get('tab') || 'exchange';

  return (
    <section>
      <Link
        to='/admin/exchange-return?tab=exchange'
        className={`px-6 py-2 w-full transition-colors duration-200 ${
          activeTab === 'exchange'
            ? 'text-primary-200 font-semibold border-b-2 border-primary-200'
            : ' hover:bg-primary-150'
        }`}
      >
        교환
      </Link>
      <Link
        to='/admin/exchange-return?tab=return'
        className={`px-6 py-2 w-full transition-colors duration-200 ${
          activeTab === 'return'
            ? 'text-primary-200 font-semibold border-b-2 border-primary-200 '
            : ' hover:bg-primary-150'
        }`}
      >
        반품
      </Link>
    </section>
  );
}
