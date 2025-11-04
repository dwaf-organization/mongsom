export default function SignUpFormHeader() {
  return (
    <div>
      <ul className='flex justify-between items-center border-b border-gray-500 pb-4'>
        <li>
          <h3 className='text-xl md:text-2xl font-semibold text-start font-pretendard '>
            기본 정보
          </h3>
        </li>

        <li className='flex items-center gap-2'>
          <p className='text-red-500'> *</p>
          <p className='text-sm md:text-base'> 필수 입력사항</p>
        </li>
      </ul>
    </div>
  );
}
