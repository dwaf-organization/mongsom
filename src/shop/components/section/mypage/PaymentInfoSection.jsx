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
      <div className='flex gap-10 pt-6 text-sm'>
        <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
          <li>결제 수단</li>
          <li>결제 금액</li>
          <li>결제 일시</li>
        </ul>
        <ul className='flex flex-col gap-4 text-left px-4'>
          <li>{order.paymentMethod} 결제</li>

          <li>{order.finalPrice.toLocaleString()}원</li>
          <li>{formatDate(order.paymentAt)}</li>
        </ul>
      </div>
    </section>
  );
}
