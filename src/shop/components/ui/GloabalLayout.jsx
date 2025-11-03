import MobileNav from '../../layout/header/MobileNav';

export default function GloabalLayout({ children }) {
  return (
    <div className='min-h-[calc(100vh-200px)]'>
      {children}
      <MobileNav />
    </div>
  );
}
