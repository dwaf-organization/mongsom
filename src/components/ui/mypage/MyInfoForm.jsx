import FormField from '../SignUp/FormField';
import AddressInput from '../AddressInput';
import { Button } from '../button';

export default function MyInfoForm() {
  const userInfo = {
    userId: 'user123',
    password: '••••••••',
    confirmPassword: '••••••••',
    name: '홍길동',
    phone1: '010',
    phone2: '1234',
    phone3: '5678',
    email: 'hong@example.com',
    address: {
      zonecode: '12345',
      addressDetail: '서울특별시 강남구 테헤란로 123',
      userDetailAddress: '101동 1001호',
    },
  };

  return (
    <div>
      <section className='flex flex-col justify-center py-6 space-y-6 '>
        <FormField
          id='userId'
          label='아이디'
          placeholder='아이디를 입력하세요'
          required
          message={'(영문 소문자/숫자 , 4~16자)'}
          value={userInfo.userId}
          readOnly
          className='focus:outline-none'
        />

        <FormField
          id='password'
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          message={'(영문 대소문자/숫자/특수문자 중 2개 이상, 8~20자)'}
          value={userInfo.password}
          readOnly
        />

        <FormField
          id='confirmPassword'
          label='비밀번호 확인'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          value={userInfo.confirmPassword}
        />

        <FormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={userInfo.name}
          readOnly
          className='focus:outline-none'
        />

        <FormField id='phone' label='휴대전화'>
          <div className='flex items-center gap-2 w-full'>
            <input
              type='text'
              value={userInfo.phone1}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              value={userInfo.phone2}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='text'
              value={userInfo.phone3}
              className='border rounded-md p-2 flex-1 focus:outline-primary-200 border-gray-400'
            />
          </div>
        </FormField>

        <AddressInput
          id='address'
          label='주소'
          value={userInfo.address}
          variant='signup'
        />

        <FormField id='email' label='이메일'>
          <input
            type='email'
            value={userInfo.email}
            className='border rounded-md p-3 flex-1 focus:outline-primary-200 border-gray-400'
          />
        </FormField>
      </section>
      <div className='flex justify-center'>
        <Button
          type='button'
          className='w-fit px-8  py-2 mt-11 mx-auto text-lg rounded-none'
        >
          정보 수정
        </Button>
      </div>
    </div>
  );
}
