import { useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import brandStoryContents from '../../asset/image/brandStoryContents.png';

export default function MoreButton({
  imageSrc,
  imageAlt = 'more visual',
  className = '',
}) {
  const [showImage, setShowImage] = useState(false);
  const imageBlockRef = useRef(null);
  const topAnchorRef = useRef(null);

  const handleExpand = () => {
    setShowImage(true);
    requestAnimationFrame(() => {
      if (imageBlockRef.current) {
        imageBlockRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  };

  const handleCollapse = () => {
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    setTimeout(() => setShowImage(false), 150);
  };

  return (
    <>
      <div ref={topAnchorRef} />

      {!showImage && (
        <button
          type='button'
          onClick={handleExpand}
          aria-label='더보기'
          className={[
            'absolute bottom-2 md:bottom-24 left-1/2 z-10 -translate-x-1/2',
            'flex w-fit items-center justify-center gap-2',
            'rounded-full px-6 md:px-14 py-1 md:py-2 text-xl',
            'bg-black-100/50 text-white backdrop-blur-sm',
            'hover:bg-black/60 transition',
            className,
          ].join(' ')}
        >
          <p className='whitespace-nowrap text-xs md:text-sm'>더보기</p>
          <ChevronDownIcon className='h-4 w-4 text-white' />
        </button>
      )}

      {showImage && (
        <section
          ref={imageBlockRef}
          className='mx-auto mt-8 w-full max-w-5xl px-4 animate-[fadeIn_.4s_ease]'
        >
          <img
            src={imageSrc || brandStoryContents}
            alt={imageAlt}
            loading='lazy'
            className='w-full rounded-2xl object-cover'
          />

          <div className='mt-4 flex justify-center py-10'>
            <button
              type='button'
              onClick={handleCollapse}
              className={[
                'flex w-fit items-center justify-center gap-2 rounded-full px-6 md:px-14 py-2 text-xs md:text-xl bg-black-100/50 text-white backdrop-blur-sm hover:bg-black/60 transition',
              ]}
            >
              접기
              <ChevronDownIcon className='h-4 w-4 text-white rotate-180 ' />
            </button>
          </div>
        </section>
      )}

      {/* <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style> */}
    </>
  );
}
