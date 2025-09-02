import { Button } from '../../ui/button';
import AdditionalInfoInput from './AdditionalInfoInput';
import FormField from './FormField';

export default function SignUpForm() {
  return (
    <form>
      <section className='flex flex-col justify-center py-6 space-y-6 '>
        <FormField
          id='userId'
          label='아이디'
          placeholder='아이디를 입력하세요'
          required
        />
        <FormField
          id='password'
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
        />
        <FormField
          id='confirmPassword'
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
        />
        <FormField
          id='username'
          label='이름'
          placeholder='이름을 입력하세요'
          required
        />
        <FormField id='address' label='주소'>
          <div className='flex flex-col gap-2 w-full max-w-[500px]'>
            <div className='flex items-center gap-2'>
              <input
                id='address'
                type='text'
                className='border border-gray-400 rounded-md p-2 w-full'
              />
              <button
                type='button'
                className='bg-black-100 text-white text-sm whitespace-nowrap h-[42px] rounded-md p-2 max-w-[168px]'
              >
                주소검색
              </button>
            </div>
            <input
              id='addressDetail1'
              type='text'
              className='border border-gray-400 rounded-md p-2 max-w-[500px] w-full'
            />
            <input
              id='addressDetail2'
              type='text'
              className='border border-gray-400 rounded-md p-2 max-w-[500px] w-full'
            />
          </div>
        </FormField>
        <FormField id='phonenumber' label='휴대전화'>
          <div className='flex items-center gap-2 max-w-[500px] w-full'>
            <input
              id='phone1'
              type='text'
              name='phone1'
              maxLength='3'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
            -
            <input
              id='phone2'
              type='text'
              name='phone2'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
            -
            <input
              id='phone3'
              type='text'
              name='phone3'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
          </div>
        </FormField>
        <FormField id='phonenumber' label='휴대전화2'>
          <div className='flex items-center gap-2 max-w-[500px] w-full'>
            <input
              id='phone1'
              type='text'
              name='phone1'
              maxLength='3'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
            -
            <input
              id='phone2'
              type='text'
              name='phone2'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
            -
            <input
              id='phone3'
              type='text'
              name='phone3'
              maxLength='4'
              className='border border-gray-400 rounded-md p-2 w-full'
            />
          </div>
        </FormField>
        <FormField
          id='email'
          label='이메일'
          type='email'
          placeholder='이메일을 입력하세요'
          required
        />
      </section>

      <AdditionalInfoInput />
      <Button className='w-full p-4 mt-11 mx-auto text-2xl'>회원가입</Button>
    </form>
  );
}
