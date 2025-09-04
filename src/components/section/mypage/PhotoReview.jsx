import { Button } from '../../ui/button';

export default function PhotoReview() {
  return (
    <section className='flex py-10 gap-4 border-b border-gray-400'>
      <p className='font-semibold text-left pb-4 whitespace-nowrap mr-[100px] '>
        사진 첨부
      </p>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <Button className='w-fit py-2 rounded-none' variant='outline'>
            사진 첨부하기
          </Button>
          <p className='text-sm'>2/3</p>
        </div>
        <div className='flex items-center gap-4'>
          <img
            src='https://picsum.photos/200/300'
            alt='reviewphoto'
            className='w-[70px] h-[70px] object-cover'
          />
          <img
            src='https://picsum.photos/200/300'
            alt='reviewphoto'
            className='w-[70px] h-[70px] object-cover'
          />
        </div>
      </div>
    </section>
  );
}
