import OrderDeliveryStatus from '../../ui/mypage/OrderDeliveryStatus';
import OrderListTable from '../../ui/mypage/OrderListTable';

export default function MypageMain() {
  return (
    <section className='pt-10'>
      <p className='text-2xl font-semibold text-left'>홍길동님, 안녕하세요</p>
      <OrderDeliveryStatus />
      <OrderListTable />
    </section>
  );
}
