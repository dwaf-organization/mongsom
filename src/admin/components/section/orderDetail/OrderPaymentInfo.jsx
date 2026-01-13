import { formatDate, formatDateTime } from '../../../utils/dateUtils';

export default function OrderPaymentInfo({ order }) {
  if (!order) {
    return (
      <div className='py-10 text-sm text-gray-500'>주문 정보가 없습니다.</div>
    );
  }

  const { paymentInfo } = order;

  const fmtPrice = n =>
    typeof n === 'number' ? n.toLocaleString() + '원' : (n ?? '').toString();

  const rows = [
    { label: '결제 방법', value: paymentInfo?.deliveryStatusReason || '-' },
    { label: '결제 수단', value: paymentInfo?.paymentMethod || '무통장 입금' },
    { label: '결제 상태', value: paymentInfo?.paymentStatus || '-' },
    {
      label: '총 상품 금액',
      value: fmtPrice(
        order?.orderItems?.reduce((acc, item) => acc + item.lineTotalPrice, 0),
      ),
    },
    {
      label: '마일리지 할인',
      value: fmtPrice(paymentInfo?.usedMileage),
    },
    {
      label: '배송비',
      value: fmtPrice(paymentInfo?.deliveryPrice),
    },
    { label: '총 결제 금액', value: fmtPrice(paymentInfo?.finalPrice) },
    {
      label: '결제 일시',
      value: formatDateTime(paymentInfo?.paymentCreatedAt),
    },
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
