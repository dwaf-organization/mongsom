// src/admin/schema/ProductSchema.js
import { z } from 'zod';

export const ProductSchema = z
  .object({
    name: z.string().trim().min(1, '상품명을 입력하세요.'),
    contents: z.string().min(1, '상품 설명을 입력하세요.'), // 실제 비어있는지 superRefine에서 추가체크
    productImgUrls: z
      .array(z.string().min(1))
      .min(1, '썸네일 이미지를 1장 이상 등록하세요.'),
    premium: z.union([z.literal(0), z.literal(1)], {
      message: '상품 분류를 선택하세요.',
    }),
    optNames: z
      .array(z.string().trim().min(1, '옵션명이 비어있습니다.'))
      .min(1, '옵션을 1개 이상 등록하세요.'),
    price: z.coerce
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
  })
  .superRefine((val, ctx) => {
    // HTML 태그 제거 후 실제 텍스트 비어있는지 검사
    const textOnly = val.contents
      ?.replace(/<[^>]*>/g, '')
      ?.replace(/&nbsp;/g, ' ')
      ?.trim();
    if (!textOnly) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contents'],
        message: '상품 설명을 입력하세요.',
      });
    }

    // discountPrice 검증(선택) — 계산값과 다르면 경고
    const base =
      (Number.isFinite(val.price) ? val.price : 0) +
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
