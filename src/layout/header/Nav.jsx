export default function Nav() {
  return (
    <nav className="flex justify-between items-center h-full w-full font-pretendard font-medium">
      <ul className="grid grid-cols-3  gap-3 justify-center items-center h-full">
        <li className="text-center">
          <a href="/">홈</a>
        </li>
        <li className="text-center">
          <a href="/brand">브랜드</a>
        </li>
        <li className="text-center">
          <a href="/product">상품</a>
        </li>
      </ul>
     
     <ul className="grid grid-cols-2 gap-3 h-full">
        <li className="text-center">
            <a href="/login">로그인 /</a>
            <a href="/signup">회원가입</a>
        </li>
        <li className="text-center">
            <a href="/cart">장바구니</a>
        </li>
     </ul>
    </nav>
  );
}