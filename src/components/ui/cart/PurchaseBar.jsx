import { Button } from '../button';
import { useNavigate } from 'react-router-dom';

export default function PurchaseBar() {
  const navigate = useNavigate();

  return (
    <div className=''>
      <Button
        className='w-full font-bold text-xl font-pretendard mt-11 bg-black-100 text-white py-3 hover:bg-black-100/90'
        variant='default'
        onClick={() => {
          navigate('/order');
        }}
      >
        구매하기
      </Button>
    </div>
  );
}
