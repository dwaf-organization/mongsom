import { RightChevron } from '../../../asset/icons';
import { statusList } from '../../../constants/orderStatus';

export default function OrderDeliveryStatus() {
  return (
    <section>
      <div className='text-gray-50 pt-6 text-xs text-right'>
        최근 3개월동안 구매한 상품
      </div>

      <ul className='flex items-center justify-between text-center pt-6 pb-5 px-8'>
        {statusList.map((status, idx) => (
          <div key={status.label} className='flex-1 relative'>
            <li className='text-3xl font-semibold font-inter text-gray-50'>
              {status.count}
            </li>
            <li className='mt-2 text-lg font-medium text-foreground'>
              {status.label}
            </li>
            {idx < statusList.length - 1 && (
              <li className='absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 '>
                <RightChevron />
              </li>
            )}
          </div>
        ))}
      </ul>
    </section>
  );
}
