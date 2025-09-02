import { useEffect } from 'react';

export default function Modal({
  title,
  children,
  onClose,
  showCloseButton = true,
  size = 'md',
  className = '',
}) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      default:
        return 'max-w-lg';
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl w-full mx-4 ${getSizeClasses()} ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 text-2xl leading-none'
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
