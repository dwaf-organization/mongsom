import { cn } from '../../lib/utils';
import mongsomLogo from '../../asset/logo/mongsom logo.png';

export default function Footer() {
  return (
    <footer
      className={cn(
        'bg-primary-100 text-black-100 pt-4 pb-20 md:py-8 ',
        'border-t border-gray-500',
      )}
    >
      <div className='container mx-auto px-4 text-xs mb:text-sm'>
        <div className='flex flex-col items-start  font-pretendard'>
          <img src={mongsomLogo} alt='Mongsom Logo' className='h-4 w-auto' />
          <p className='text-black-100 font-pretendard'>주식회사 몽솜</p>
        </div>
        <ul className='flex gap-4 pt-3  font-pretendard '>
          <li>
            <p className='whitespace-nowrap'>대표자: 김준겸</p>
          </li>
          <li>
            <p className=''>
              주소: 부산광역시 강서구 녹산산단361로 42,3층(송정동)
            </p>
          </li>

          <li>
            <p className='hidden md:block'>고객센터: 1899-0993</p>
          </li>
        </ul>

        <ul className='flex gap-4  font-pretendard'>
          <li className='md:hidden'>
            <p className=''>고객센터: 1899-0993</p>
          </li>
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
