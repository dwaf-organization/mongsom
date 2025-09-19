import { useState, useRef, useCallback } from 'react';

import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';

export default function AddProductInfoSection() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [optionInput, setOptionInput] = useState('');

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
    deliveryPrice: 3000, // 고정
  });

  const {
    handleFileInput,
    uploadedImages,
    uploadedImageUrls,
    loading,
    handleRemoveImage,
    uploadFile,
  } = useImageUpload('products_thumbnails');

  // 에디터 이미지 업로드
  const handleEditorImageUpload = useCallback(
    async file => {
      try {
        const url = await uploadFile(file);
        return url;
      } catch (e) {
        console.error('에디터 이미지 업로드 실패:', e);
        return null;
      }
    },
    [uploadFile],
  );

  // 공통 입력 처리 + 판매가 계산
  const handleInputChange = e => {
    const { name, value } = e.target;
    setProductData(prev => {
      const updated = { ...prev, [name]: value };
      const basePrice =
        (parseFloat(updated.price || 0) || 0) +
        (parseFloat(updated.salesMargin || 0) || 0);
      updated.discountPrice = updated.discountPer
        ? Math.floor(
            basePrice * (1 - (parseFloat(updated.discountPer) || 0) / 100),
          )
        : basePrice;
      return updated;
    });
  };

  // 옵션 추가/삭제
  const addOption = () => {
    if (!optionInput.trim()) return;
    setProductData(prev => ({
      ...prev,
      optNames: [...prev.optNames, optionInput.trim()],
    }));
    setOptionInput('');
  };

  const removeOption = idx => {
    setProductData(prev => ({
      ...prev,
      optNames: prev.optNames.filter((_, i) => i !== idx),
    }));
  };

  // 썸네일 업로드 버튼
  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  // 제출
  const submit = e => {
    e.preventDefault();
    const html = editorRef.current?.getHTML() || '';
    const finalData = {
      ...productData,
      contents: html,
      productImgUrls: uploadedImageUrls,
    };
    console.log('상품 데이터:', finalData);
  };

  return (
    <form onSubmit={submit}>
      {/* === 상품명 + 설명 박스(원래 레이아웃 유지) === */}
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
        {/* 상품명 */}
        <div className='grid grid-cols-[200px_1fr] rounded-2xl'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            상품명
          </div>
          <div className='p-4 border-b flex flex-wrap items-center gap-3'>
            <input
              placeholder='상품명을 입력하세요'
              name='name'
              value={productData.name}
              onChange={handleInputChange}
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className='grid grid-cols-[200px_1fr] h-full w-full'>
          <div className='bg-primary-100  font-semibold px-6 py-4 border-b'>
            상품 설명
          </div>
          <RichEditor
            ref={editorRef}
            value={productData.contents} // 초기값만 반영(비제어형)
            variant='full'
            maxChars={20000}
            minHeight={300}
            onUploadImage={handleEditorImageUpload}
            // onChange는 생략하여 깜빡임 방지
          />
        </div>
      </div>

      {/* === 이미지 정보 === */}
      <section className='py-10'>
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
          </div>
        </div>
      </section>

      {/* === 상품 분류 === */}
      <section className='py-10'>
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
              onClick={() => setProductData(prev => ({ ...prev, premium: 1 }))}
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
              onClick={() => setProductData(prev => ({ ...prev, premium: 0 }))}
            >
              일반 상품
            </Button>
          </div>
        </div>
      </section>

      {/* === 옵션 등록 === */}
      <section className='py-10'>
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
          </div>
        </div>
      </section>

      {/* === 가격 계산 === */}
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
              />
              <p>KRW</p>
              <input
                name='salesMargin'
                value={productData.salesMargin}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>KRW</p>
              <input
                name='discountPer'
                value={productData.discountPer}
                onChange={handleInputChange}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
              />
              <p>%</p>
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
        <Button type='submit' className='w-fit px-20 py-4'>
          상품 등록
        </Button>
      </div>
    </form>
  );
}
