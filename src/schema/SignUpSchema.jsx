import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: '이름은 1자 이상이어야 합니다.' }),
  userId: z
    .string()
    .min(4, '아이디는 4자 이상이어야 합니다')
    .max(20, '아이디는 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 특수문자, 공백 없이 입력해주세요'),
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(20, '비밀번호는 20자 이하여야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[0-9])|(?=.*[a-z])(?=.*[!@#$%^&*])|(?=.*[A-Z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[!@#$%^&*])/,
      '비밀번호는 영문 대소문자, 숫자, 특수문자 중 2개 이상을 포함해야 합니다',
    ),
  confirmPassword: z.string().min(1, '비밀번호 확인을 입력하세요.'),
});
