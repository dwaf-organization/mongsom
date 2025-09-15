import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

export default function GlobalToast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
