import React from 'react';
import instagram from '../../asset/image/instagramLogo.png';

export default function InstagramButton() {
  const handleClick = () => {
    window.open(' https://www.instagram.com/mongsom_official/', '_blank');
  };
  return (
    <button
      onClick={handleClick}
      className='fixed bottom-28 right-4 md:right-12 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50'
    >
      <img src={instagram} alt='Instagram' className='rounded-2xl' />
    </button>
  );
}
