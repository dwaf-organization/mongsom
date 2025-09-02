import { RightChevron } from '../../../asset/icons';

export default function BreadCrumbSection() {
  return (
    <ul className='flex items-center gap-4 justify-center font-pretendard text-xl pt-5 border-b-2 border-black-100 pb-10'>
      <li>
        <p className='font-semibold text-black'>장바구니</p>
      </li>
      <RightChevron />
      <li>
        <p>주문 / 결제</p>
      </li>
      <RightChevron />
      <li>주문 완료</li>
    </ul>
  );
}
