import { useState, useRef, useCallback, useEffect } from 'react';

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

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProductData(prev => {
      const updated = { ...prev, [name]: value };
      const base =
        (parseFloat(updated.price || 0) || 0) +
        (parseFloat(updated.salesMargin || 0) || 0);

      updated.discountPrice = updated.discountPer
        ? Math.floor(base * (1 - (parseFloat(updated.discountPer) || 0) / 100))
        : base;

      setErrors(prevErr => ({ ...prevErr, [name]: undefined }));
      if (
        name === 'price' ||
        name === 'salesMargin' ||
        name === 'discountPer'
      ) {
        setErrors(prevErr => ({ ...prevErr, discountPrice: undefined }));
      }
      if (name === 'name') {
        setErrors(prevErr => ({ ...prevErr, name: undefined }));
      }
      return updated;
    });
  };

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

    const html = editorRef.current?.getHTML?.() ?? '';

    const base =
      (parseFloat(productData.price || 0) || 0) +
      (parseFloat(productData.salesMargin || 0) || 0);
    const computedDiscountPrice = productData.discountPer
      ? Math.floor(
          base * (1 - (parseFloat(productData.discountPer) || 0) / 100),
        )
      : base;

    const finalData = {
      ...productData,
      contents: html,
      productImgUrls: uploadedImageUrls,
      price: Number(productData.price || 0),
      salesMargin: Number(productData.salesMargin || 0),
      discountPer: Number(productData.discountPer || 0),
      discountPrice: Number(computedDiscountPrice || 0),
      deliveryPrice: Number(productData.deliveryPrice || 3000),
    };

    const result = ProductSchema.safeParse(finalData);
    if (!result.success) {
      const errMap = toErrorMap(result.error.issues);
      setErrors(errMap);

      const firstKey = Object.keys(errMap)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
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

        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
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

      <section className='py-10' data-field='productImgUrls'>
        <p className='font-semibold text-xl mb-4'>이미지 정보</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
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
              className=' h-[100px] bg-primary-100 w-[100px] rounded-lg flex items-center justify-center'
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

      <section className='py-10' data-field='premium'>
        <p className='font-semibold text-xl mb-4'>표시 설정</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
            상품분류 선택
          </div>
          <div className='p-6 flex items-center gap-3'>
            <Button
              type='button'
              className={`w-fit py-2 px-4 ${
                productData.premium === 1
                  ? 'bg-primary-100 text-white'
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
              className={`w-fit py-2 px-4 ${
                productData.premium === 0
                  ? 'bg-primary-100 text-white'
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

      <section className='py-10' data-field='optNames'>
        <p className='font-semibold text-xl mb-4'>옵션 등록</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b whitespace-nowrap'>
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

      <section className='py-10'>
        <div className='rounded-lg border border-gray-400'>
          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100  font-semibold px-6 py-6 border-b'>
              <div className='flex flex-col gap-3'>
                <p>공급가</p> <p>+</p> <p>판매 마진</p> <p>+</p> <p>할인</p>
              </div>
            </div>
            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                name='price'
                value={productData.price}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='price'
              />
              <p>KRW</p>
              <input
                name='salesMargin'
                value={productData.salesMargin}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='salesMargin'
              />
              <p>KRW</p>
              <input
                name='discountPer'
                value={productData.discountPer}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='discountPer'
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
                {errors.discountPrice && (
                  <p className='text-red-500 text-sm'>
                    {errors.discountPrice[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
              판매 가격
            </div>
            <div className='p-4 border-b flex flex-wrap items-center gap-3'>
              <input
                name='discountPrice'
                value={productData.discountPrice}
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
          disabled={submitting}
        >
          {submitting ? '등록 중…' : '등록'}
          상품 등록
        </Button>
      </div>
    </form>
  );
}
