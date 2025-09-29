import { formatDate } from '../../../utils/dateUtils';

export default function OrderPaymentInfo({ order }) {
  if (!order) {
    return (
      <div className='py-10 text-sm text-gray-500'>주문 정보가 없습니다.</div>
    );
  }

  const fmtPrice = n =>
    typeof n === 'number' ? n.toLocaleString() + '원' : (n ?? '').toString();

  const shippingFee = 3000;

  const rows = [
    { label: '결제 수단', value: order.paymentMethod },
    { label: '결제 일자', value: formatDate(order.paymentAt) },
    {
      label: '주문 상태',
      value: order.changeState === 0 ? '결제 완료' : '기타',
    },
    { label: '총 결제 금액', value: fmtPrice(order.finalPrice) },
  ];

  return (
    <section className='pt-10'>
      <h2 className='text-xl font-semibold text-left'>결제 정보</h2>

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
