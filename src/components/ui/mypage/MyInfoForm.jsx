import FormField from '../SignUp/FormField';
import AddressInput from '../AddressInput';
import { Button } from '../button';

export default function MyInfoForm() {
  const userInfo = {
    userId: 'user123',
    password: '••••••••',
    confirmPassword: '••••••••',
    name: '홍길동',
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
          readOnly
        />

        <FormField
          id='name'
          label='이름'
          placeholder='이름을 입력하세요'
          required
          value={userInfo.name}
          readOnly
        />

        <AddressInput
          id='address'
          label='주소'
          value={userInfo.address}
          variant='signup'
          readOnly
        />

        <FormField
          id='email'
          label='이메일'
          type='email'
          placeholder='이메일을 입력하세요'
          required
          value={userInfo.email}
          readOnly
        />
      </section>

      <Button
        type='button'
        className='w-fit px-8  py-2 mt-11 mx-auto text-lg rounded-none'
      >
        정보 수정
      </Button>
    </div>
  );
}
