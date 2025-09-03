import { Button } from '../../components/ui/button';
import { LeftChevron } from '../../asset/icons';

export default function MoreButton() {
  return (
    <Button className=' text-primary-200 w-fit rounded-full' variant='outline'>
      펼치기
      <LeftChevron className='transform -rotate-90 text-primary-200' />
    </Button>
  );
}
