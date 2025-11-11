import React from 'react';
import { LeftChevron } from '../../asset/icons';

export default function BackButton({ className, text }) {
  return (
    <button
      onClick={() => window.history.back()}
      className='flex items-center gap-2'
    >
      <LeftChevron className='w-6 h-6' />
      <p>{text}</p>
    </button>
  );
}
