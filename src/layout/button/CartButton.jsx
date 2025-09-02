import { Button } from '../../components/ui/button';

export default function CartButton({ onClick }) {
  return (
    <Button
      className='w-full font-bold text-xl font-pretendard'
      variant='outline'
      onClick={onClick}
    >
      장바구니
    </Button>
  );
}
