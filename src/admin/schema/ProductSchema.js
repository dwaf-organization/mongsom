// src/admin/schema/ProductSchema.js
import { z } from 'zod';

const hasMeaningfulContent = (html = '') => {
  const str = String(html || '');
  const hasImg = /<img\b[^>]*>/i.test(str);
  const textOnly = str
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // 태그 제거
    .replace(/&nbsp;|\u200B/g, '') // nbsp, zero-width 제거
    .trim();
  return hasImg || textOnly.length > 0;
};

const OptionValueSchema = z.object({
  valueName: z.string().trim().min(1, '옵션값 이름을 입력하세요.'),
  priceAdjustment: z.coerce.number().default(0),
  stockStatus: z.union([z.literal(0), z.literal(1)]).default(1),
  sortOrder: z.coerce.number().min(1).default(1),
});

const OptionTypeSchema = z.object({
  typeName: z.string().trim().min(1, '옵션 타입명을 입력하세요.'),
  isRequired: z.union([z.literal(0), z.literal(1)]).default(1),
  sortOrder: z.coerce.number().min(1).default(1),
  optionValues: z.array(OptionValueSchema).min(1, '옵션값을 1개 이상 등록하세요.'),
});

export const ProductSchema = z
  .object({
    name: z.string().trim().min(1, '상품명을 입력하세요.'),
    contents: z.string().refine(hasMeaningfulContent, {
      message: '상품 설명을 입력하세요. (이미지 또는 텍스트 중 하나는 필수)',
    }),
    premium: z.union([z.literal(0), z.literal(1)], {
      message: '상품 분류를 선택하세요.',
    }),
    basePrice: z.coerce
      .number({ invalid_type_error: '공급가를 숫자로 입력하세요.' })
      .min(0, '공급가는 0 이상이어야 합니다.'),
    salesMargin: z.coerce
      .number({ invalid_type_error: '판매 마진을 숫자로 입력하세요.' })
      .min(0, '판매 마진은 0 이상이어야 합니다.'),
    discountPer: z.coerce
      .number({ invalid_type_error: '할인율을 숫자로 입력하세요.' })
      .min(0, '할인율은 0 이상이어야 합니다.')
      .max(100, '할인율은 0~100 사이여야 합니다.'),
    discountPrice: z.coerce
      .number({ invalid_type_error: '판매 가격 계산에 오류가 있습니다.' })
      .min(0, '판매 가격은 0 이상이어야 합니다.'),
    deliveryPrice: z.coerce
      .number({ invalid_type_error: '배송비를 숫자로 입력하세요.' })
      .min(0, '배송비는 0 이상이어야 합니다.'),
    stockStatus: z.union([z.literal(0), z.literal(1)], {
      message: '재고 상태를 선택하세요.',
    }),
    isAvailable: z.union([z.literal(0), z.literal(1)], {
      message: '판매 여부를 선택하세요.',
    }),
    productImgUrls: z
      .array(z.string().min(1))
      .min(1, '썸네일 이미지를 1장 이상 등록하세요.'),
    optionTypes: z.array(OptionTypeSchema).nullable().optional(),
  })
  .superRefine((val, ctx) => {
    // discountPrice 검증 — 계산값과 다르면 경고
    const base =
      (Number.isFinite(val.basePrice) ? val.basePrice : 0) +
      (Number.isFinite(val.salesMargin) ? val.salesMargin : 0);
    const expected = Math.floor(base * (1 - (val.discountPer || 0) / 100));
    if (Number.isFinite(val.discountPrice) && val.discountPrice !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discountPrice'],
        message: '판매 가격이 계산값과 일치하지 않습니다.',
      });
    }
  });
