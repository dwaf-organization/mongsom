import { formatDate } from '../../../utils/dateUtils';

export default function OrderInfo({ order }) {
  if (!order) {
    return (
      <div className='py-10 text-sm text-gray-500'>주문 정보가 없습니다.</div>
    );
  }

  const { orderInfo, paymentInfo } = order;

  const fmtPrice = n =>
    typeof n === 'number' ? n.toLocaleString() + '원' : (n ?? '').toString();

  const rows = [
    { label: '주문 번호', value: orderInfo?.orderNum || '-' },
    { label: '주문 일자', value: formatDate(orderInfo?.orderCreatedAt) },
    { label: '주문 상태', value: orderInfo?.deliveryStatus || '-' },
    // { label: '총 상품 금액', value: fmtPrice(paymentInfo?.totalPrice) },
    // { label: '배송비', value: fmtPrice(paymentInfo?.deliveryPrice) },
    // { label: '사용 마일리지', value: fmtPrice(paymentInfo?.usedMileage) },
    // { label: '총 결제 금액', value: fmtPrice(paymentInfo?.finalPrice) },
  ];

  return (
    <section className='pt-10'>
      <h2 className='text-xl font-semibold text-left'>주문 정보</h2>

      <div className='mt-4 rounded-xl border border-gray-500 overflow-hidden max-w-[1000px]'>
        <div className='grid grid-cols-[180px_1fr] text-sm'>
          {rows.map((row, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === rows.length - 1;
            return (
              <div key={row.label} className={['contents'].join(' ')}>
                <div
                  className={[
                    'bg-gray-100 text-gray-900 px-4 py-4 border-gray-400',
                    'border-r',
                    isFirst ? '' : 'border-t',
                    isLast ? '' : '',
                  ].join(' ')}
                >
                  {row.label}
                </div>

                <div
                  className={[
                    'px-4 py-4 border-gray-400',
                    isFirst ? '' : '',
                    isLast ? '' : 'border-b',
                  ].join(' ')}
                >
                  {row.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
