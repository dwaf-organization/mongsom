import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ChatFlutingButton from './ChatFlutingButton';
import mongsomLogo from '../../asset/logo/mongsom-logo-chat.png';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onDown = e => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const toggle = () => setOpen(v => !v);

  const handleMouseDown = () => setPressing(true);
  const handleMouseUp = () => setTimeout(() => setPressing(false), 120);

  return (
    <div
      ref={wrapperRef}
      className='fixed bottom-6 right-4 md:bottom-10 md:right-10 z-50'
    >
      <div
        role='dialog'
        aria-hidden={!open}
        className={[
          'absolute right-0',

          'bottom-[64px]',
          'w-[90vw] max-w-[360px]',
          'rounded-2xl border border-gray-900 bg-gray-900 shadow-2xl',
          'p-4 md:p-5',
          'origin-bottom-right transition-all  duration-200 will-change-transform',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto '
            : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        <span
          className='absolute -bottom-2 right-4 block h-3 w-3 rotate-45 bg-gray-900 border-r border-b border-gray-900'
          aria-hidden
        />
        <header className='flex items-center justify-between'>
          <p>mongsom</p>
          <button className='text-sm text-end w-full text-white'>
            운영시간보기
          </button>
        </header>
        <div
          className='mb-2 bg-gray-800 p-2 rounded-lg
        '
        >
          <div className='flex items-start gap-3'>
            <img
              src={mongsomLogo}
              alt='몽솜'
              className='w-10 h-10 md:w-12 md:h-12 object-contain bg-white rounded-2xl p-1 shrink-0'
            />
            <div className='flex-1'>
              <p className='text-white text-sm md:text-base font-semibold leading-tight'>
                몽솜
              </p>
              <p className='mt-0.5 text-[11px] md:text-xs text-gray-300 leading-snug'>
                By your side, every little moment.
                <br /> 사소한 순간까지 당신곁에, 몽솜
              </p>
            </div>
          </div>
        </div>
        <div className='text-sm'>
          <ChatFlutingButton />
        </div>
        <div className='mt-3 flex justify-end'>
          <button
            className='text-xs text-gray-500 hover:text-gray-700'
            onClick={() => setOpen(false)}
          >
            닫기
          </button>
        </div>
      </div>

      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded={open}
        onClick={toggle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={[
          'relative flex items-center justify-center rounded-2xl px-3 w-14 h-14 shadow-lg',
          'transition-all duration-200',

          open
            ? 'bg-black-100 text-white shadow-black/40 scale-95'
            : 'bg-primary-100 border text-black shadow-primary-100/40',

          pressing ? 'scale-90 ring-4 ring-black/10' : 'scale-100',
        ].join(' ')}
      >
        <span
          className={[
            'block transition-transform duration-200 will-change-transform',
            open ? 'rotate-90' : 'rotate-0',
          ].join(' ')}
          aria-hidden
        >
          {open ? (
            <X />
          ) : (
            <p className='text-xs font-semibold whitespace-nowrap'>
              1:1 <br /> 문의하기
            </p>
          )}
        </span>

        <span
          aria-hidden
          className={[
            'pointer-events-none absolute inset-0 rounded-full',
            'transition-opacity duration-200',
            open ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
          style={{
            boxShadow: pressing
              ? '0 0 0 12px rgba(0,0,0,0.05)'
              : '0 0 0 0 rgba(0,0,0,0)',
          }}
        />
      </button>
    </div>
  );
}
