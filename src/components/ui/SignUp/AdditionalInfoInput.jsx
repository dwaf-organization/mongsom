export default function AdditionalInfoInput() {
  return (
    <div className='flex flex-col gap-4 max-w-[980px] mx-auto'>
      <h3 className='text-xl font-semibold text-start font-pretendard border-b border-gray-500 pb-6'>
        추가 정보 (선택)
      </h3>
      <label
        htmlFor='birthday'
        className='flex items-center gap-20 border-b border-gray-500 pb-6'
      >
        <span className='min-w-[90px] text-left'>생년월일</span>
        <div className='flex items-center gap-2 max-w-[500px] w-full'>
          <input
            id='birthday'
            type='text'
            name='birthday'
            className='border border-gray-400 rounded-md p-2 max-w-[500px] w-full'
          />
          년
          <input
            id='birthday'
            type='text'
            name='phonenumber'
            className='border border-gray-400 rounded-md p-2 w-full'
          />
          월
          <input
            id='birthday'
            type='text'
            name='birthday'
            className='border border-gray-400 rounded-md p-2  w-full'
          />
          일
        </div>
      </label>
    </div>
  );
}
