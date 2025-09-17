import { z } from 'zod';

export const OrderSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone1: z.string().min(3, '전화번호를 입력해주세요.'),
  phone2: z.string().min(4, '전화번호를 입력해주세요.'),
  phone3: z.string().min(4, '전화번호를 입력해주세요.'),
  zipCode: z.string().min(1, '주소를 검색해주세요.'),
  address: z.string().min(1, '주소를 검색해주세요.'),
  address2: z.string().min(1, '상세주소를 입력해주세요.'),
  additionalInfo: z.string().optional(),
});
