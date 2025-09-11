import { useEffect } from 'react';

export default function Modal({
  title,
  children,
  onClose,
  showCloseButton = true,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
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
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div
        className='absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm'
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      />

      <div
        className={`relative bg-white rounded-lg shadow-xl border border-primary-200 ${getSizeClasses()} max-h-[90vh] overflow-hidden flex flex-col z-10 ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
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

        <div className='flex-1 overflow-y-auto'>{children}</div>
      </div>
    </div>
  );
}
