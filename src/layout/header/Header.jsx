import { Link } from 'react-router-dom';

import mongsomLogo from '../../asset/logo/mongsom logo.png';
import Nav from './Nav';

export default function Header() {
  return (
    <header className='sticky top-0 z-50  w-full bg-primary-100'>
      <div className='container mx-auto py-6 justify-between items-center h-full'>
        <div className='flex items-center'>
          <h1>
            <Link to='/'>
              <img
                src={mongsomLogo}
                alt='Mongsom Logo'
                className='h-8 w-auto'
              />
            </Link>
          </h1>
          <Nav />
        </div>
      </div>
    </header>
  );
}
