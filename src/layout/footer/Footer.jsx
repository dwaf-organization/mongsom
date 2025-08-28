import { cn } from '../../lib/utils';
import mongsomLogo from '../../asset/logo/mongsom logo.png';

export default function Footer() {
  return (
   <footer className={cn(
     "bg-primary-100 text-black-100 py-8",
     "border-t border-gray-500"
   )}>
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-start  font-pretendard">
        <img src={mongsomLogo} alt="Mongsom Logo" className="h-4 w-auto" />
        <p className="text-black-100 font-pretendard text-sm">
          (주)몽솜
        </p>
      </div>
    
        <ul className="flex gap-4 pt-3 text-sm font-pretendard">
          <li>
            <p>대표자: 몽솜</p>
          </li>
          <li>
            <p>주소: 서울특별시 강남구 강남대로 123</p>
          </li>
          <li>
            <p>고객센터: 02-1234-5678</p>
          </li>
        </ul>

        <ul className="flex gap-4 text-sm font-pretendard">
          <li>
            <p>사업자등록번호 : 123-45-67890</p>
          </li>
          <li>
            <p>통신판매업신고 : 제 2025-서울강남-0123호</p>
          </li>
          <li>
            <p>e-mail: mongsom@gmail.com</p>
          </li>
        </ul>
      
      </div>
   
   </footer>
  );
}