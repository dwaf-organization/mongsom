export default function PaymentInfoSection() {
  return (
    <section>
      <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        결제 정보
      </p>
      <div className='flex gap-10 pt-6 text-sm'>
        <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
          <li>결제수단</li>
          <li>결제 금액</li>
          <li>결제 일시</li>
          <li>할인 금액</li>
          <li>배송비</li>
        </ul>
        <ul className='flex flex-col gap-4 text-left px-4'>
          <li>무통장입금</li>
          <li>30,000원</li>
          <li>2025-01-01 12:00</li>
          <li>10,000원</li>
          <li>3,000원</li>
        </ul>
      </div>
    </section>
  );
}
