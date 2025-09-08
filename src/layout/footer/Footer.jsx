import { cn } from '../../lib/utils';
import mongsomLogo from '../../asset/logo/mongsom logo.png';

export default function Footer() {
  return (
    <footer
      className={cn(
        'bg-primary-100 text-black-100 py-8',
        'border-t border-gray-500',
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-start  font-pretendard'>
          <img src={mongsomLogo} alt='Mongsom Logo' className='h-4 w-auto' />
          <p className='text-black-100 font-pretendard text-sm'>(주)몽솜</p>
        </div>

        <ul className='flex gap-4 pt-3 text-sm font-pretendard'>
          <li>
            <p>대표자: 몽솜</p>
          </li>
          <li>
            <p>주소: 부산광역시 강서구 녹산산단361로 42,3층(송정동)</p>
          </li>
          <li>{/* <p>고객센터: 02-1234-5678</p> */}</li>
        </ul>

        <ul className='flex gap-4 text-sm font-pretendard'>
          <li>
            <p>사업자등록번호 : 265-87-03828</p>
          </li>
          <li>
            <p></p>
          </li>
          <li>{/* <p>e-mail: mongsom@gmail.com</p> */}</li>
        </ul>
      </div>
    </footer>
  );
}
