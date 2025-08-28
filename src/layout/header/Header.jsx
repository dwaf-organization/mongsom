import mongsomLogo from '../../asset/logo/mongsom logo.png';
import Nav from './Nav';

export default function Header() {
  return (
    <header className=" bg-primary-100">
        <div className='container mx-auto py-6 justify-between items-center h-full'>
            <div className='flex items-center'>
      <h1 className="font-pretendard font-bold text-2xl">
          <a href="/">
        <img 
          src={mongsomLogo} 
          alt="Mongsom Logo" 
          className="h-8 w-auto"
        />
        </a>
      </h1>
       <Nav />
       </div>

       </div>
    </header>
  );
}