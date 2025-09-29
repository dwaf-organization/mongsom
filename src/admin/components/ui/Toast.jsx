// Toast.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsVisible(false);
      onClose && setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const box = (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg
                  transition-all duration-300 pointer-events-none z-[2147483647]
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                  ${toastStyles(type)}`}
    >
      <div className='flex items-center gap-2 pointer-events-auto'>
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose && setTimeout(onClose, 300);
          }}
          className='ml-2 text-lg leading-none hover:opacity-70'
        >
          ×
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(box, document.body)
    : null;
}

function toastStyles(type) {
  switch (type) {
    case 'success':
      return 'bg-primary-200 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-blue-500 text-white';
  }
}
