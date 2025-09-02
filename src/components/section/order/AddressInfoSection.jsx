import AddressFormField from '../../ui/AddressFormField';

export default function AddressInfoSection() {
  return (
    <section className='py-10'>
      <h3 className='text-xl text-left font-semibold mb-4 '>배송지 정보</h3>
      <form className='flex flex-col gap-4 w-full'>
        <AddressFormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
        />
        <AddressFormField id='phonenumber' label='휴대전화' required>
          <div className='flex items-center gap-2 w-full'>
            <input
              id='phone1'
              type='text'
              name='phone1'
              maxLength='3'
              className='border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200'
            />
            -
            <input
              id='phone2'
              type='text'
              name='phone2'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200'
            />
            -
            <input
              id='phone3'
              type='text'
              name='phone3'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200'
            />
          </div>
        </AddressFormField>

        <AddressFormField id='address' label='주소' required>
          <div className='flex flex-col gap-2 w-full '>
            <div className='flex items-center gap-2'>
              <input
                id='address'
                type='text'
                className='border border-gray-400 rounded-md p-2 focus:outline-none '
                readOnly
              />
              <button
                type='button'
                className='bg-black-100 text-white text-sm whitespace-nowrap h-[42px] rounded-md p-2 '
              >
                주소검색
              </button>
            </div>
            <input
              id='addressDetail1'
              type='text'
              className='border border-gray-400 rounded-md p-2 w-full focus:outline-none'
              readOnly
            />
            <input
              id='addressDetail2'
              type='text'
              className='border border-gray-400 rounded-md p-2 w-full focus:outline-primary-200'
              placeholder='상세주소를 입력하세요'
            />
          </div>
        </AddressFormField>
        <label
          htmlFor='additionalInfo'
          className='text-lg font-semibold text-left py-10'
        >
          <span className='w-full '>배송메시지</span>
          <textarea
            id='additionalInfo'
            className='border border-gray-400 rounded-md p-2 w-full resize-none focus:outline-primary-200'
            placeholder='배송메시지를 입력하세요'
            required
          />
        </label>
      </form>
    </section>
  );
}
