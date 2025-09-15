import { cn } from '../lib/utils';

export default function Mainwrapper({ children }) {
  return (
    <main>
        <div className={cn('min-h-screen top-0')}>
            {children}
        </div>
    </main>
  );
}