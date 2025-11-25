import React from 'react';
import instagram from '../../asset/image/instagramLogo.png';

export default function InstagramButton() {
  const handleClick = () => {
    window.open(' https://www.instagram.com/mongsom_official/', '_blank');
  };
  return (
    <button
      onClick={handleClick}
      className='fixed bottom-36 md:bottom-32 right-4 md:right-10 w-12 h-12 md:w-16 md:h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50'
    >
      <img
        src={instagram}
        alt='Instagram'
        className='rounded-2xl md:rounded-3xl'
      />
    </button>
  );
}
