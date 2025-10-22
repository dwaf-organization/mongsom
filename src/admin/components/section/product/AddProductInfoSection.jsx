import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';
import { ProductSchema } from '../../../schema/ProductSchema';
import { createProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';

export default function AddProductInfoSection() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [optionInput, setOptionInput] = useState('');
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const [productData, setProductData] = useState({
    name: '',
    contents: '',
    productImgUrls: [],
    premium: 1,
    optNames: [],
    price: '',
    salesMargin: '',
    discountPer: '',
    discountPrice: '',
    deliveryPrice: 3000,
  });
  const [submitting, setSubmitting] = useState(false);

  const {
    handleFileInput,
    uploadedImages,
    uploadedImageUrls,
    loading,
    handleRemoveImage,
    uploadFile,
    resetUpload,
  } = useImageUpload('products_thumbnails');

  // === 이미지 업로드 콜백 안정화
  const uploadFileRef = useRef(uploadFile);
  useEffect(() => {
    uploadFileRef.current = uploadFile;
  }, [uploadFile]);

  const handleEditorImageUpload = useCallback(async file => {
    try {
      return await uploadFileRef.current(file);
    } catch (e) {
      console.error('에디터 이미지 업로드 실패:', e);
      return null;
    }
  }, []);

  // === 금액 계산 유틸
  const toNum = v => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);

  // ✅ 실시간 판매가(할인가) 계산
  const computedDiscountPrice = useMemo(() => {
    const base = toNum(productData.price) + toNum(productData.salesMargin);
    const dp = toNum(productData.discountPer);
    const price = Math.floor(base * (1 - dp / 100));
    // 할인 퍼센트가 비어있으면 기본 base 사용
    return Number.isFinite(dp) && productData.discountPer !== '' ? price : base;
  }, [productData.price, productData.salesMargin, productData.discountPer]);

  // ✅ 판매가 유효성(0 이상)
  const isDiscountPriceValid = computedDiscountPrice > 0;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProductData(prev => {
      const updated = { ...prev, [name]: value };
      // 표시용 판매가도 동기화(읽기전용 input에 반영)
      const base = toNum(updated.price) + toNum(updated.salesMargin);
      const dp = toNum(updated.discountPer);
      updated.discountPrice =
        updated.discountPer === '' ? base : Math.floor(base * (1 - dp / 100));

      setErrors(prevErr => ({
        ...prevErr,
        [name]: undefined,
        ...(name === 'price' || name === 'salesMargin' || name === 'discountPer'
          ? { discountPrice: undefined }
          : {}),
      }));
      return updated;
    });
  };

  // === 옵션
  const addOption = () => {
    if (!optionInput.trim()) return;
    setProductData(prev => ({
      ...prev,
      optNames: [...prev.optNames, optionInput.trim()],
    }));
    setOptionInput('');
    setErrors(prev => ({ ...prev, optNames: undefined }));
  };

  const removeOption = idx => {
    setProductData(prev => ({
      ...prev,
      optNames: prev.optNames.filter((_, i) => i !== idx),
    }));
  };

  // ✅ 옵션 입력에서 Enter 누르면 폼 제출 방지 + 옵션 추가
  const onOptionKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const toErrorMap = issues => {
    const map = {};
    for (const issue of issues) {
      const root = issue.path?.[0] ?? 'form';
      const key = typeof root === 'number' ? 'form' : String(root);
      if (!map[key]) map[key] = [];
      map[key].push(issue.message);
    }
    return map;
  };

  const submit = async e => {
    e.preventDefault();

    // ✅ 판매가 0 미만 방지 (0 이상만 허용)
    if (!isDiscountPriceValid) {
      setErrors(prev => ({
        ...prev,
        discountPrice: ['판매가격은 0 이상이어야 합니다.'],
      }));
      // 해당 섹션으로 스크롤
      document
        .querySelector('[data-field="discountPer"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const html = editorRef.current?.getHTML?.() ?? '';

    const base = toNum(productData.price) + toNum(productData.salesMargin);
    const dp = toNum(productData.discountPer);
    const finalDiscountPrice =
      productData.discountPer === '' ? base : Math.floor(base * (1 - dp / 100));

    const finalData = {
      ...productData,
      contents: html,
      productImgUrls: uploadedImageUrls,
      price: toNum(productData.price),
      salesMargin: toNum(productData.salesMargin),
      discountPer: toNum(productData.discountPer),
      discountPrice: toNum(finalDiscountPrice),
      deliveryPrice: toNum(productData.deliveryPrice || 3000),
    };

    const result = ProductSchema.safeParse(finalData);
    if (!result.success) {
      const errMap = toErrorMap(result.error.issues);
      setErrors(errMap);
      const firstKey = Object.keys(errMap)[0];
      document
        .querySelector(`[data-field="${firstKey}"]`)
        ?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});

    try {
      setSubmitting(true);
      const resp = await createProduct(result.data);
      console.log('✅ 상품 등록 성공:', resp);
      addToast('상품 등록이 완료되었습니다.', 'success');

      setProductData({
        name: '',
        contents: '',
        productImgUrls: [],
        premium: 1,
        optNames: [],
        price: '',
        salesMargin: '',
        discountPer: '',
        discountPrice: '',
        deliveryPrice: 3000,
      });
      editorRef.current?.setHTML?.('');
      resetUpload();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('❌ 상품 등록 실패:', err);
      addToast('상품 등록에 실패했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        {/* 상품명 */}
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
            상품명
          </div>
          <div
            className='p-4 border-b flex flex-wrap items-center gap-3'
            data-field='name'
          >
            <input
              placeholder='상품명을 입력하세요'
              name='name'
              value={productData.name}
              onChange={handleInputChange}
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
            {errors.name && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.name[0]}
              </p>
            )}
          </div>
        </div>

        {/* 상품 설명 */}
        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
            상품 설명
          </div>
          <div className='p-4 pt-0' data-field='contents'>
            <RichEditor
              ref={editorRef}
              initialValue={productData.contents}
              variant='full'
              maxChars={20000}
              minHeight={300}
              onUploadImage={handleEditorImageUpload}
            />
            {errors.contents && (
              <p className='text-red-500 text-sm mt-2'>{errors.contents[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 */}
      <section className='py-10' data-field='productImgUrls'>
        <p className='font-semibold text-xl mb-4'>이미지 정보</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            썸네일 등록
          </div>
          <div className='p-6 border-b flex flex-wrap items-center gap-3'>
            {uploadedImages.map((url, index) => (
              <div key={index} className='relative group'>
                <img
                  src={url}
                  alt={`product-thumbnail-${index}`}
                  className='w-[100px] h-[100px] object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors'
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type='button'
              className='h-[100px] bg-primary-100 w-[100px] rounded-lg flex items-center justify-center'
              onClick={handleButtonClick}
              disabled={loading}
            >
              {loading ? '업로드 중...' : <Plus />}
            </button>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              onChange={handleFileInput}
              className='hidden'
            />
            {errors.productImgUrls && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.productImgUrls[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 표시 설정 */}
      <section className='py-10' data-field='premium'>
        <p className='font-semibold text-xl mb-4'>표시 설정</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            상품분류 선택
          </div>
          <div className='p-6 flex items-center gap-3'>
            <Button
              type='button'
              variant={productData.premium === 1 ? 'default' : 'outline'}
              className={`w-fit py-2 px-4 ${
                productData.premium === 1
                  ? 'text-white'
                  : 'border border-gray-400 text-gray-600'
              }`}
              onClick={() => {
                setProductData(prev => ({ ...prev, premium: 1 }));
                setErrors(prev => ({ ...prev, premium: undefined }));
              }}
            >
              프리미엄 선물용
            </Button>
            <Button
              type='button'
              variant={productData.premium === 0 ? 'default' : 'outline'}
              className={`w-fit py-2 px-4 ${
                productData.premium === 0
                  ? 'text-white'
                  : 'border border-gray-400 text-gray-600'
              }`}
              onClick={() => {
                setProductData(prev => ({ ...prev, premium: 0 }));
                setErrors(prev => ({ ...prev, premium: undefined }));
              }}
            >
              일반 상품
            </Button>
            {errors.premium && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.premium[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 옵션 등록 */}
      <section className='py-10' data-field='optNames'>
        <p className='font-semibold text-xl mb-4'>옵션 등록</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            옵션 등록
          </div>
          <div className='p-6 flex flex-col gap-3'>
            <div className='flex items-start gap-3'>
              <input
                type='text'
                value={optionInput}
                placeholder='옵션명을 입력하세요'
                className='border rounded-md p-2 w-full max-w-[500px] focus:outline-primary-200 border-gray-400'
                onChange={e => setOptionInput(e.target.value)}
                onKeyDown={onOptionKeyDown} // ✅ Enter → 옵션 추가, 제출 방지
              />
              <div className='flex flex-col gap-2'>
                <Button
                  type='button'
                  className='w-fit py-2 px-4'
                  onClick={addOption}
                >
                  + 등록
                </Button>
              </div>
            </div>

            {productData.optNames.map((opt, idx) => (
              <div key={idx} className='flex items-center gap-3'>
                <p className='text-gray-600 w-full max-w-[500px]'>
                  {idx + 1}) {opt}
                </p>
                <Button
                  type='button'
                  className='w-fit py-2 px-4 border-gray-500 text-gray-500'
                  variant='outline'
                  onClick={() => removeOption(idx)}
                >
                  X 삭제
                </Button>
              </div>
            ))}

            {errors.optNames && (
              <p className='text-red-500 text-sm mt-2'>{errors.optNames[0]}</p>
            )}
          </div>
        </div>
      </section>

      {/* 가격 섹션 */}
      <section className='py-10'>
        <div className='rounded-lg border border-gray-400'>
          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100 font-semibold px-6 py-6 border-b'>
              <div className='flex flex-col gap-3'>
                <p>공급가</p> <p>+</p> <p>판매 마진</p> <p>+</p> <p>할인</p>
              </div>
            </div>
            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                type='number'
                inputMode='decimal'
                name='price'
                value={productData.price}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='price'
              />
              <p>KRW</p>
              <input
                type='number'
                name='salesMargin'
                value={productData.salesMargin}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='salesMargin'
                inputMode='decimal'
              />
              <p>KRW</p>
              <input
                type='number'
                name='discountPer'
                value={productData.discountPer}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='discountPer'
                inputMode='decimal'
              />
              <p>%</p>

              <div className='w-full mt-2'>
                {errors.price && (
                  <p className='text-red-500 text-sm'>{errors.price[0]}</p>
                )}
                {errors.salesMargin && (
                  <p className='text-red-500 text-sm'>
                    {errors.salesMargin[0]}
                  </p>
                )}
                {errors.discountPer && (
                  <p className='text-red-500 text-sm'>
                    {errors.discountPer[0]}
                  </p>
                )}
                {(!isDiscountPriceValid || errors.discountPrice) && (
                  <p className='text-red-500 text-sm'>
                    {errors.discountPrice?.[0] ||
                      '판매가격은 0 이상이어야 합니다.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
              판매 가격
            </div>
            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                name='discountPrice'
                value={computedDiscountPrice}
                readOnly
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400 bg-gray-100'
              />
              <p>KRW</p>
            </div>
          </div>
        </div>
      </section>

      <div className='flex justify-center'>
        <Button
          type='submit'
          className='w-fit px-20 py-4'
          disabled={submitting || !isDiscountPriceValid}
        >
          {submitting ? '등록 중…' : '등록'}
        </Button>
      </div>
    </form>
  );
}
