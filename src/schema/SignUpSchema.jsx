import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: '이름은 1자 이상이어야 합니다.' }),
  userId: z
    .string()
    .min(4, { message: '영문 소문자/숫자 , 4~16자 이어야 합니다.' }),
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z
    .string()
    .min(8, { message: '영문 대문자/숫자 , 8~16자 이어야 합니다.' }),
  passwordConfirm: z
    .string()
    .min(8, { message: '영문 대문자/숫자 , 8~16자 이어야 합니다.' }),
  address: z.string().min(1, { message: '주소는 1자 이상이어야 합니다.' }),
  addressDetail: z
    .string()
    .min(1, { message: '상세주소는 1자 이상이어야 합니다.' }),
});
