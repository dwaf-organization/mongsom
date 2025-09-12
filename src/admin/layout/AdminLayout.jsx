import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/mongsom-admin-logo.png';
import { navigation } from '../constants/navList';

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className='flex'>
      <nav className=' px-2 text-center w-full max-w-[200px]'>
        <div className='flex items-center justify-center pt-10 pb-5 border-b border-gray-400'>
          <img src={logo} alt='logo' />
        </div>

        {navigation.map(item => (
          <Link
            key={item.name}
            to={item.href}
            className={`group flex items-center justify-center px-2 py-4 font-medium mb-1 text-center border-b border-gray-400 ${
              location.pathname === item.href
                ? ' text-primary-200'
                : ' hover:text-primary-200'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className='flex-1'>
        <main>
          <div className='w-full'>{children}</div>
        </main>
      </div>
    </div>
  );
}
