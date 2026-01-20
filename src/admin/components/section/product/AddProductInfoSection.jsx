import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';
import { ProductSchema } from '../../../schema/ProductSchema';
import { createProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function AddProductInfoSection() {
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  // 옵션 추가 체크박스 상태
  const [hasOption, setHasOption] = useState(false);

  // 옵션 타입 관리 (카테고리 2개 고정)
  const defaultOptionTypes = [
    {
      typeName: '',
      isRequired: 1,
      sortOrder: 1,
      optionValues: [
        {
          valueName: '선택안함',
          priceAdjustment: 0,
          stockStatus: 1,
          sortOrder: 1,
        },
      ],
    },
    {
      typeName: '',
      isRequired: 1,
      sortOrder: 2,
      optionValues: [
        {
          valueName: '선택안함',
          priceAdjustment: 0,
          stockStatus: 1,
          sortOrder: 1,
        },
      ],
    },
  ];
  const [optionTypes, setOptionTypes] = useState(defaultOptionTypes);

  // 각 옵션 타입별 새 옵션값 입력
  const [newOptionValues, setNewOptionValues] = useState({});

  const [productData, setProductData] = useState({
    name: '',
    contents: '',
    productImgUrls: [],
    premium: 1,
    price: '',
    stockStatus: 1,
    isAvailable: 1,
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

  const toNum = v => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);

  const computedDiscountPrice = useMemo(() => {
    const base = toNum(productData.price) + toNum(productData.salesMargin);
    const dp = toNum(productData.discountPer);
    const price = Math.floor(base * (1 - dp / 100));
    return Number.isFinite(dp) && productData.discountPer !== '' ? price : base;
  }, [productData.price, productData.salesMargin, productData.discountPer]);

  const isDiscountPriceValid = computedDiscountPrice > 0;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setProductData(prev => {
      const updated = { ...prev, [name]: value };
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

  // 카테고리명 변경
  const updateTypeName = (typeIdx, name) => {
    setOptionTypes(prev =>
      prev.map((type, i) =>
        i === typeIdx ? { ...type, typeName: name } : type,
      ),
    );
  };

  // 옵션값 추가
  const addOptionValue = typeIdx => {
    const inputValue = newOptionValues[typeIdx] || {
      name: '',
      price: 0,
      isSoldOut: false,
    };
    if (!inputValue.name?.trim()) return;

    setOptionTypes(prev =>
      prev.map((type, i) => {
        if (i !== typeIdx) return type;
        return {
          ...type,
          optionValues: [
            ...type.optionValues,
            {
              valueName: inputValue.name.trim(),
              priceAdjustment: Number(inputValue.price) || 0,
              stockStatus: inputValue.isSoldOut ? 0 : 1,
              sortOrder: type.optionValues.length + 1,
            },
          ],
        };
      }),
    );
    setNewOptionValues(prev => ({
      ...prev,
      [typeIdx]: { name: '', price: 0, isSoldOut: false },
    }));
  };

  // 옵션값 삭제
  const removeOptionValue = (typeIdx, valueIdx) => {
    setOptionTypes(prev =>
      prev.map((type, i) => {
        if (i !== typeIdx) return type;
        return {
          ...type,
          optionValues: type.optionValues.filter((_, vi) => vi !== valueIdx),
        };
      }),
    );
  };

  const onOptionValueKeyDown = (e, typeIdx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOptionValue(typeIdx);
    }
  };

  const onInputKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
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

    if (!isDiscountPriceValid) {
      setErrors(prev => ({
        ...prev,
        discountPrice: ['판매가격은 0 이상이어야 합니다.'],
      }));
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
      name: productData.name,
      contents: html,
      premium: productData.premium,
      basePrice: toNum(productData.price),
      salesMargin: toNum(productData.salesMargin),
      discountPer: toNum(productData.discountPer),
      discountPrice: toNum(finalDiscountPrice),
      deliveryPrice: toNum(productData.deliveryPrice || 3000),
      stockStatus: productData.stockStatus,
      isAvailable: productData.isAvailable,
      productImgUrls: uploadedImageUrls,
      optionTypes: (() => {
        if (!hasOption) return null;
        const filtered = optionTypes.filter(
          type => type.typeName.trim() !== '',
        );
        return filtered.length > 0 ? filtered : null;
      })(),
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
      if (resp.code === 1) {
        console.log('✅ 상품 등록 성공:', resp);
        addToast('상품 등록이 완료되었습니다.', 'success');
        navigate('/admin/products-list');
      } else {
        addToast(resp.data.message, 'error');
      }

      setProductData({
        name: '',
        contents: '',
        productImgUrls: [],
        premium: 1,
        price: '',
        salesMargin: '',
        discountPer: '',
        discountPrice: '',
        deliveryPrice: 3000,
      });
      // 옵션 관련 상태 초기화
      setHasOption(false);
      setOptionTypes(defaultOptionTypes);
      setNewOptionValues({});
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
              type='text'
              maxLength={80}
              value={productData.name}
              onChange={handleInputChange}
              onKeyDown={onInputKeyDown}
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
            <p className='text-red-500 text-xs'>
              * 상품명은 최대 80자 까지 입력 가능합니다{' '}
            </p>
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
          <div className='p-4 pt-4' data-field='contents'>
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
        <div className='grid grid-cols-[200px_1fr] rounded-t-lg border border-t-none border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            카테고리 선택
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

        {/* 품절여부 */}
        <div className='grid grid-cols-[200px_1fr]  border border-t-none border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            품절여부
          </div>
          <div className='p-6 flex items-center gap-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={productData.stockStatus === 0}
                onChange={e => {
                  setProductData(prev => ({
                    ...prev,
                    stockStatus: e.target.checked ? 0 : 1,
                  }));
                  setErrors(prev => ({ ...prev, stockStatus: undefined }));
                }}
                className='w-5 h-5 accent-primary-500 cursor-pointer'
              />
              <span className='text-gray-700'>품절처리</span>
            </label>

            {errors.stockStatus && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.stockStatus[0]}
              </p>
            )}
          </div>
        </div>

        {/* 판매여부 */}
        <div className='grid grid-cols-[200px_1fr] rounded-b-lg border border-t-none border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            판매여부
          </div>
          <div className='p-6 flex items-center gap-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={productData.isAvailable === 0}
                onChange={e => {
                  setProductData(prev => ({
                    ...prev,
                    isAvailable: e.target.checked ? 0 : 1,
                  }));
                  setErrors(prev => ({ ...prev, isAvailable: undefined }));
                }}
                className='w-5 h-5 accent-primary-500 cursor-pointer'
              />
              <span className='text-gray-700'>판매중단</span>
            </label>

            {errors.isAvailable && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.isAvailable[0]}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className='border-b border-gray-500 border-t py-4'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={hasOption}
            onChange={e => {
              setHasOption(e.target.checked);
              if (!e.target.checked) {
                setOptionTypes(defaultOptionTypes);
                setNewOptionValues({});
              }
            }}
            className='w-5 h-5 accent-primary-500 cursor-pointer'
          />
          <span className='text-gray-700'>옵션 추가</span>
        </label>
      </section>

      {/* 옵션 등록 - 체크박스가 체크되어 있을 때만 표시 */}
      {hasOption && (
        <section className='py-10' data-field='optionTypes'>
          <p className='font-semibold text-xl mb-4'>옵션 등록</p>

          {/* 고정 2개 카테고리 */}
          {optionTypes.map((type, typeIdx) => (
            <div
              key={typeIdx}
              className={`grid grid-cols-[200px_1fr] border border-gray-400 ${
                typeIdx === 0 ? 'rounded-t-lg' : 'border-t-0'
              } ${typeIdx === optionTypes.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
                <input
                  type='text'
                  value={type.typeName}
                  placeholder={`카테고리명: ex) ${typeIdx === 0 ? '색상' : '포장'}`}
                  className='border rounded-md p-2 w-full focus:outline-primary-200 border-gray-400'
                  onChange={e => updateTypeName(typeIdx, e.target.value)}
                />
              </div>
              <div className='p-6 border-b flex flex-col gap-3'>
                {/* 새 옵션값 입력 */}
                <div className='flex items-center gap-3'>
                  <input
                    type='text'
                    placeholder='옵션명'
                    value={newOptionValues[typeIdx]?.name || ''}
                    onChange={e =>
                      setNewOptionValues(prev => ({
                        ...prev,
                        [typeIdx]: { ...prev[typeIdx], name: e.target.value },
                      }))
                    }
                    onKeyDown={e => onOptionValueKeyDown(e, typeIdx)}
                    className='border rounded-md p-2 flex-1 max-w-[300px] focus:outline-primary-200 border-gray-400'
                  />
                  <input
                    type='number'
                    placeholder='옵션추가금액'
                    value={newOptionValues[typeIdx]?.price || ''}
                    onChange={e =>
                      setNewOptionValues(prev => ({
                        ...prev,
                        [typeIdx]: {
                          ...prev[typeIdx],
                          price: e.target.value,
                        },
                      }))
                    }
                    onKeyDown={e => onOptionValueKeyDown(e, typeIdx)}
                    className='border rounded-md p-2 w-[150px] focus:outline-primary-200 border-gray-400'
                  />
                  <label className='flex items-center gap-1 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={newOptionValues[typeIdx]?.isSoldOut || false}
                      onChange={e =>
                        setNewOptionValues(prev => ({
                          ...prev,
                          [typeIdx]: {
                            ...prev[typeIdx],
                            isSoldOut: e.target.checked,
                          },
                        }))
                      }
                      className='w-4 h-4 accent-primary-500 cursor-pointer'
                    />
                    <span className='text-sm text-gray-700'>품절</span>
                  </label>
                  <Button
                    type='button'
                    className='w-fit'
                    onClick={() => addOptionValue(typeIdx)}
                  >
                    + 등록
                  </Button>
                </div>

                {/* 등록된 옵션값 목록 */}
                {type.optionValues.map((val, valIdx) => (
                  <div key={valIdx} className='flex items-center gap-3 text-sm'>
                    <div className='flex flex-1 items-center border rounded-md p-2 border-gray-400 max-w-[550px]'>
                      <p className='flex-1 max-w-[300px] text-gray-600'>
                        {valIdx + 1}) {val.valueName}
                      </p>
                      <p className='w-[150px] text-gray-600 whitespace-nowrap'>
                        옵션추가금 : {val.priceAdjustment.toLocaleString()}원
                      </p>
                      {val.stockStatus === 0 && (
                        <label className='flex items-center gap-1'>
                          <input
                            type='checkbox'
                            checked
                            readOnly
                            className='w-4 h-4 accent-primary-500'
                          />
                          <span className='text-sm text-gray-700'>품절</span>
                        </label>
                      )}
                    </div>
                    <button
                      type='button'
                      onClick={() => removeOptionValue(typeIdx, valIdx)}
                      className='text-gray-500 hover:text-gray-700 text-xl'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {errors.optionTypes && (
            <p className='text-red-500 text-sm mt-2'>{errors.optionTypes[0]}</p>
          )}
        </section>
      )}

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
                onKeyDown={onInputKeyDown}
                className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                data-field='price'
              />
              <p>KRW</p>
              <input
                type='number'
                name='salesMargin'
                value={productData.salesMargin}
                onChange={handleInputChange}
                onKeyDown={onInputKeyDown}
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
                onKeyDown={onInputKeyDown}
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
