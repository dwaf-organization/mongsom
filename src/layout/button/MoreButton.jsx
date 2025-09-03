import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function MoreButton() {
  return (
    <div className='bg-black-100/50 flex w-fit items-center justify-center gap-2 text-black-100 px-8 py-2 rounded-full text-xl'>
      <p className='text-sm text-white whitespace-nowrap'> 더보기</p>

      <ChevronDownIcon className='w-4 h-4 text-white' />
    </div>
  );
}
