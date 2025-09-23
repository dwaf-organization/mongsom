export default function RecipientInfoSection({ order }) {
  console.log('🚀 ~ RecipientInfoSection ~ order:', order);
  return (
    <section>
      <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        받는 사람 정보
      </p>
      <div className='flex gap-10 pt-6 text-sm'>
        <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
          <li>받는 사람</li>
          <li>연락처</li>
          <li>주소</li>
          <li>배송 메시지</li>
        </ul>
        <ul className='flex flex-col gap-4 text-left px-4'>
          <li>{order.receivedUserName}</li>
          <li>{order.receivedUserPhone}</li>
          <li>
            ({order.receivedUserZipCode}){order.receivedUserAddress}
            {order.receivedUserAddress2}
          </li>
          <li>{order.message || '-'}</li>
        </ul>
      </div>
    </section>
  );
}
