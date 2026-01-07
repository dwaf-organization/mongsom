export default function OrderReceivedInfo({ order }) {
  if (!order) {
    return (
      <div className='py-10 text-sm text-gray-500'>주문 정보가 없습니다.</div>
    );
  }

  const { deliveryInfo } = order;

  const fullAddress = [
    deliveryInfo?.receivedUserAddress,
    deliveryInfo?.receivedUserAddress2,
  ]
    .filter(Boolean)
    .join(' ');

  const rows = [
    { label: '받는 사람', value: deliveryInfo?.receivedUserName || '-' },
    { label: '연락처', value: deliveryInfo?.receivedUserPhone || '-' },
    {
      label: '우편번호',
      value: deliveryInfo?.receivedUserZipCode || '-',
    },
    { label: '주소', value: fullAddress || '-' },
    { label: '배송 메시지', value: deliveryInfo?.message || '-' },
  ];

  return (
    <section className='pt-10'>
      <h2 className='text-xl font-semibold text-left'>받는 사람 정보</h2>

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
