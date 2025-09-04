import { Link } from 'react-router-dom';

import ChatIcon from '../../asset/icons/ChatIcon';
export default function ChatFlutingButton() {
  return (
    <div className='fixed bottom-10 right-10 z-50 bg-primary-200 rounded-full'>
      <Link className='text-white px-4 py-4 rounded-full text-sm flex flex-col items-center gap-2'>
        <ChatIcon className='w-8 h-8' />

        <span className='text-center font-semibold'>
          견적/대량구매 <br /> 문의
        </span>
      </Link>
    </div>
  );
}
