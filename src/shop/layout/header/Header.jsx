import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import mongsomLogo from '../../asset/logo/mongsom logo.png';
import Nav from './Nav';
import CartIcon from '../../asset/icons/CartIcon';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className='sticky top-0 z-50 w-full bg-primary-100'>
      <div className='container mx-auto py-4 md:py-6 h-full'>
        <div className='flex justify-between items-center md:justify-start px-4 xl:px-0'>
          <h1>
            <Link to='/'>
              <img
                src={mongsomLogo}
                alt='Mongsom Logo'
                className='h-6 w-auto md:h-8'
              />
            </Link>
          </h1>
          {isAuthenticated && (
            <Link to='/cart' className='md:hidden'>
              <CartIcon />
            </Link>
          )}

          <Nav />
        </div>
      </div>
    </header>
  );
}
