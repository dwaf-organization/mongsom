import { Button } from '../button';
import { useNavigate } from 'react-router-dom';

export default function ReviewButtons() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/mypage?tab=myReview&myreview=completedReview');
  };

  const handleCancel = () => {
    navigate('/mypage?tab=myReview');
  };
  return (
    <div className='flex justify-center gap-4'>
      <Button
        className='w-fit px-10 py-2 mt-10 rounded-none border-gray-500'
        variant='outline'
        onClick={handleRegister}
      >
        취소하기
      </Button>
      <Button
        className='w-fit px-10 py-2 mt-10 rounded-none'
        onClick={handleCancel}
      >
        등록하기
      </Button>
    </div>
  );
}
