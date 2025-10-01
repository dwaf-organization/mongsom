import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function MoreButton() {
  const handleClick = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <button
      className='absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-black-100/50 flex w-fit items-center justify-center gap-2 text-black-100 px-14 py-2 rounded-full text-xl'
      onClick={handleClick}
    >
      <p className='text-sm text-white whitespace-nowrap'> 더보기</p>

      <ChevronDownIcon className='w- h-4 text-white' />
    </button>
  );
}
