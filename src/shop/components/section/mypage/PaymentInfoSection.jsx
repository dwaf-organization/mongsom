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
      <p className='md:text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        결제 정보
      </p>
      <div className='grid grid-cols-6 pt-6 text-sm'>
        {/* <div className='flex gap-10 pt-6 text-sm'> */}
        <ul className='flex flex-col gap-4 col-span-2 text-left text-gray-50 px-4 whitespace-nowrap'>
          <li>결제 방법</li>
          <li>결제 수단</li>
          <li>총 상품금액</li>
          <li>마일리지 할인</li>
          <li>배송비</li>

          <li>결제 일시</li>
        </ul>
        <ul className='flex flex-col gap-4 col-span-3 text-right px-4 whitespace-nowrap'>
          <li>{order.paymentInfo.deliveryStatusReason} </li>
          <li>{formatDate(order.paymentInfo.paymentMethod)}</li>
          <li>{order.paymentInfo.totalPrice?.toLocaleString()}원</li>
          <li>{order.paymentInfo.usedMileage?.toLocaleString()}원</li>
          <li>{order.paymentInfo.deliveryPrice?.toLocaleString()}원</li>

          <li>{formatDate(order.paymentInfo.paymentUpdatedAt)}</li>
        </ul>
      </div>

      <section className='grid grid-cols-6 items-center border-y border-gray-500 mt-6 py-6'>
        <p className='md:text-lg col-span-2 font-semibold text-left px-4 whitespace-nowrap'>
          총 결제 금액
        </p>
        <p className='font-semibold col-span-3 text-right px-4 whitespace-nowrap'>
          {order.paymentInfo.paymentAmount?.toLocaleString()}원
        </p>
      </section>
      <p className='text-xs md:text-sm text-blue-500 pt-4'>
        * 무통장 입금시 결제대기 상태일 때 총 결제금액이 0원으로 표시됩니다.
      </p>
    </section>
  );
}
