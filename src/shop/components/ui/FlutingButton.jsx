import { X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ChatFlutingButton from './ChatFlutingButton';
import mongsomLogo from '../../asset/logo/mongsom-logo-chat.png';
import mongsomTextLogo from '../../asset/logo/mongsom logo.png';
import { RightChevron } from '../../asset/icons';

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);

  const wrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const onDown = e => {
      if (hoursOpen) {
        if (overlayRef.current?.contains(e.target)) return;
        if (sheetRef.current?.contains(e.target)) return;
      }
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [hoursOpen]);

  const toggle = () => setOpen(v => !v);
  const handleMouseDown = () => setPressing(true);
  const handleMouseUp = () => setTimeout(() => setPressing(false), 120);

  return (
    <>
      <div
        ref={overlayRef}
        onClick={() => setHoursOpen(false)}
        className={[
          'fixed inset-0 z-[1000] transition-opacity duration-200',
          hoursOpen
            ? 'opacity-100 bg-black/60 pointer-events-auto'
            : 'opacity-0 bg-black/0 pointer-events-none',
        ].join(' ')}
        aria-hidden={!hoursOpen}
      />

      <aside
        ref={sheetRef}
        role='dialog'
        aria-modal='true'
        aria-hidden={!hoursOpen}
        className={[
          'fixed z-[1001]',
          'right-4 md:right-10',
          'bottom-[140px] md:bottom-[105px]',
          'w-[90vw] max-w-[360px]',
          'rounded-3xl bg-gray-900 text-white shadow-2xl',
          'transition-all duration-250 ease-out will-change-transform',
          hoursOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-4 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className='flex items-center justify-between px-4 pt-3 pb-1'>
          <div className='text-sm font-semibold'>운영시간</div>
          <button
            type='button'
            aria-label='운영시간 닫기'
            onClick={() => setHoursOpen(false)}
            className='p-1 rounded-full hover:bg-white/10'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
        <div className='px-2 pb-2'>
          <div className='rounded-xl p-4 space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='inline-block h-2 w-2 rounded-full bg-emerald-400' />
              <span className='text-gray-200'>월, 화, 수, 목, 금</span>
              <span className='ml-auto text-gray-200'>
                오전 9:00 ~ 오후 4:00
              </span>
            </div>
            <div className='text-xs text-gray-400'>Timezone: Asia/Seoul</div>
          </div>
        </div>
      </aside>

      {/* 기존 챗 패널/버튼 */}
      <div
        ref={wrapperRef}
        className='fixed bottom-20 right-4 md:bottom-10 md:right-10 z-[900]'
      >
        <div
          role='dialog'
          aria-hidden={!open}
          className={[
            'absolute right-0 overflow-hidden',
            'bottom-[64px]',
            'w-[90vw] max-w-[360px]',
            'rounded-3xl bg-gray-900 shadow-2xl',
            '',
            'origin-bottom-right transition-all duration-200 will-change-transform',
            open
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none',
          ].join(' ')}
        >
          <div className='bg-gradient-to-t from-white/80 to-primary-100 h-32'>
            <img
              src={mongsomTextLogo}
              alt='몽솜로고'
              className='w-32 mx-4 py-4'
            />
          </div>

          <div className='bg-gray-900 bg-gradient-to-t from-gray-900 via-gray-900 to-white/80'>
            <div className='flex items-center justify-between w-full gap-2 px-4'>
              <p className='text-black font-semibold whitespace-nowrap shrink-0 text-black-100'>
                몽솜
              </p>
              <button
                type='button'
                onClick={() => setHoursOpen(v => !v)}
                className='text-sm text-white flex items-center ml-auto px-2 py-1 rounded-md'
              >
                <span className='whitespace-nowrap text-black-100'>
                  운영시간보기
                </span>
                <RightChevron className='w-4 h-4 ml-1' stroke='#3A3A3A' />
              </button>
            </div>

            {/* 소개 카드 */}
            <div className='mb-2 bg-gray-800 p-2 rounded-lg mx-4'>
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
                    By your side, every little moment <br />
                    사소한 순간까지 당신곁에, 몽솜
                    <br />
                    <br />
                    안녕하세요 몽솜입니다 😊 <br />
                    작은 궁금증도 물어보세요.
                    <br /> 상담은 순차적으로 진행되며,
                    <br /> 잠시만 기다려 주시면 빠르게 도와드릴게요🧡
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='text-sm px-4'>
            <ChatFlutingButton />
          </div>
          <div className='mt-3 flex justify-end m-4'>
            <button
              className='text-xs text-gray-500 hover:text-gray-300'
              onClick={() => setOpen(false)}
            >
              닫기
            </button>
          </div>
          <div
            aria-hidden
            className={[
              'pointer-events-none absolute inset-0',
              'transition-opacity duration-200',
              hoursOpen
                ? 'opacity-100 backdrop-blur-[1px] brightness-75 rounded-2xl'
                : 'opacity-0 bg-transparent',
            ].join(' ')}
          />
        </div>

        {/* 플로팅 버튼 */}
        <button
          type='button'
          aria-haspopup='dialog'
          aria-expanded={open}
          onClick={toggle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={[
            'flex items-center justify-center rounded-2xl md:rounded-3xl px-3 w-12 h-12 md:w-14 md:h-14 shadow-lg',
            'transition-all duration-200',
            open
              ? 'bg-gray-900 text-white shadow-black/40 scale-95'
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
    </>
  );
}
