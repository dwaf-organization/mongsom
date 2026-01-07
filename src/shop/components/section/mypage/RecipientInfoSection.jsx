export default function RecipientInfoSection({ order }) {
  console.log('🚀 ~ RecipientInfoSection ~ order:', order);
  return (
    <section>
      <p className='md:text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        받는 사람 정보
      </p>
      <div className='flex gap-4 md:gap-10  pt-6 text-sm'>
        <ul className='flex flex-col gap-4 text-left text-gray-50 px-4 whitespace-nowrap'>
          <li>받는 사람</li>
          <li>연락처</li>
          <li>주소</li>
          <li>배송 메시지</li>
        </ul>
        <ul className='flex flex-col gap-4 text-left px-4'>
          <li>{order.deliveryInfo.receivedUserName}</li>
          <li>{order.deliveryInfo.receivedUserPhone}</li>
          <li>
            ({order.deliveryInfo.receivedUserZipCode})
            {order.deliveryInfo.receivedUserAddress}
            {order.deliveryInfo.receivedUserAddress2}
          </li>
          <li>{order.deliveryInfo.message || '-'}</li>
        </ul>
      </div>
    </section>
  );
}
