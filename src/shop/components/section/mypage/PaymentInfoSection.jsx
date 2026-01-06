import { formatDate } from '../../../utils/dateUtils';

export default function PaymentInfoSection({ order }) {
  console.log('🚀 ~ PaymentInfoSection ~ order:', order);
  const formatDate = iso => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  return (
    <section>
      <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        결제 정보
      </p>
      <div className='grid grid-cols-6 pt-6 text-sm'>
        {/* <div className='flex gap-10 pt-6 text-sm'> */}
        <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
          <li>결제 방법</li>
          <li>결제 수단</li>
          <li>총 상품금액</li>
          <li>마일리지 할인</li>
          <li>배송비</li>

          <li>결제 일시</li>
        </ul>
        <ul className='flex flex-col gap-4 text-right px-4'>
          <li>{order.paymentInfo.deliveryStatusReason} </li>
          <li>{formatDate(order.paymentInfo.paymentMethod)}</li>
          <li>{order.paymentInfo.totalPrice?.toLocaleString()}원</li>
          <li>-{order.paymentInfo.usedMileage?.toLocaleString()}원</li>
          <li>{order.paymentInfo.deliveryPrice?.toLocaleString()}원</li>

          <li>{formatDate(order.paymentInfo.paymentUpdatedAt)}</li>
        </ul>
      </div>

      <section className='grid grid-cols-6 items-center border-y border-gray-500 my-6 py-6'>
        <p className='text-lg font-semibold text-left'>결제 금액</p>
        <p className='font-semibold text-right px-4'>
          {order.paymentInfo.paymentAmount?.toLocaleString()}원
        </p>
      </section>
    </section>
  );
}
