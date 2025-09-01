import { Button } from '../button';

export default function PurchaseBar() {
  return (
    <div className=''>
      <Button
        className='w-full font-bold text-xl font-pretendard mt-11 bg-black-100 text-white py-3'
        variant='default'
      >
        구매하기
      </Button>
    </div>
  );
}
