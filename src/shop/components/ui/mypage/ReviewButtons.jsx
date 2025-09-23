import { Button } from '../button';

export default function ReviewButtons({ onSubmit, onCancel, submitting }) {
  return (
    <div className='flex justify-center gap-4'>
      <Button
        className='w-fit px-10 py-2 mt-10 rounded-none border-gray-500'
        variant='outline'
        onClick={onCancel}
        disabled={submitting}
      >
        취소하기
      </Button>
      <Button
        className='w-fit px-10 py-2 mt-10 rounded-none'
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? '등록 중…' : '등록하기'}
      </Button>
    </div>
  );
}
