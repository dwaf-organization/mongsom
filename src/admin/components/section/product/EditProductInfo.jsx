import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';
import { updateProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { SquarePen } from 'lucide-react';

const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
// 이미지 데이터 정규화 - 객체 배열({productImgId, productImgUrl}) 형태로 유지
const normalizeImages = imgs => {
  if (!imgs) return [];
  if (Array.isArray(imgs)) {
    return imgs
      .map(img => {
        if (typeof img === 'string')
          return { productImgId: null, productImgUrl: img };
        if (img && typeof img === 'object' && img.productImgUrl)
          return { productImgId: img.productImgId ?? null, productImgUrl: img.productImgUrl };
        return null;
      })
      .filter(Boolean);
  }
  if (typeof imgs === 'string') return imgs ? [{ productImgId: null, productImgUrl: imgs }] : [];
  return [];
};

// 기본 옵션 타입 구조 (2개 고정)
const defaultOptionTypes = [
  {
    optionTypeId: null,
    typeName: '',
    isRequired: 1,
    sortOrder: 1,
    isDeleted: false,
    optionValues: [
      {
        optionValueId: null,
        valueName: '선택안함',
        priceAdjustment: 0,
        stockStatus: 1,
        sortOrder: 1,
        isDeleted: false,
      },
    ],
  },
  {
    optionTypeId: null,
    typeName: '',
    isRequired: 1,
    sortOrder: 2,
    isDeleted: false,
    optionValues: [
      {
        optionValueId: null,
        valueName: '선택안함',
        priceAdjustment: 0,
        stockStatus: 1,
        sortOrder: 1,
        isDeleted: false,
      },
    ],
  },
];

// 서버에서 받은 optionTypes를 폼에서 사용할 구조로 변환 (2개 고정)
const normalizeOptionTypes = p => {
  if (!Array.isArray(p?.optionTypes) || p.optionTypes.length === 0) {
    return defaultOptionTypes;
  }

  // 서버에서 받은 옵션 타입을 변환
  const serverTypes = p.optionTypes.map((type, idx) => ({
    optionTypeId: type.optionTypeId ?? null,
    typeName: type.typeName ?? '',
    isRequired: type.isRequired ?? 1,
    sortOrder: type.sortOrder ?? idx + 1,
    isDeleted: false,
    optionValues: Array.isArray(type.optionValues)
      ? type.optionValues.map((val, valIdx) => ({
          optionValueId: val.optionValueId ?? null,
          valueName: val.valueName ?? '',
          priceAdjustment: val.priceAdjustment ?? 0,
          stockStatus: val.stockStatus ?? 1,
          sortOrder: val.sortOrder ?? valIdx + 1,
          isDeleted: false,
        }))
      : [],
  }));

  // 2개 고정 - 부족하면 기본값으로 채움
  if (serverTypes.length < 2) {
    return [
      serverTypes[0] || defaultOptionTypes[0],
      serverTypes[1] || defaultOptionTypes[1],
    ];
  }

  // 2개만 반환
  return serverTypes.slice(0, 2);
};

// 옵션이 있는지 확인 (카테고리명이 있거나 옵션값이 있는 경우)
const hasOptionData = p => {
  if (!Array.isArray(p?.optionTypes) || p.optionTypes.length === 0) {
    return false;
  }
  return p.optionTypes.some(
    type =>
      type.typeName?.trim() ||
      (type.optionValues?.length > 0 &&
        type.optionValues.some(v => v.valueName && v.valueName !== '선택안함')),
  );
};

export default function EditProductInfoSection({ product }) {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

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
    } catch {
      return null;
    }
  }, []);

  const productKey = product?.productId ?? product?.id ?? 'new';

  const buildInitial = useCallback(
    p => ({
      productId: p?.productId ?? p?.id,
      name: p?.name ?? '',
      contents: p?.contents ?? p?.descriptionHtml ?? '',
      premium: typeof p?.premium === 'number' ? p.premium : 0,
      basePrice: String(p?.basePrice ?? p?.price ?? ''),
      salesMargin: String(p?.salesMargin ?? ''),
      discountPer: String(p?.discountPer ?? ''),
      deliveryPrice: String(p?.deliveryPrice ?? 3000),
      stockStatus: p?.stockStatus ?? 1,
      isAvailable: p?.isAvailable ?? 1,
      productImages: normalizeImages(
        p?.productImages ?? p?.productImgUrl ?? p?.images,
      ),
      optionTypes: normalizeOptionTypes(p),
    }),
    [],
  );

  const [form, setForm] = useState(buildInitial(product));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 옵션 추가 체크박스 상태 (서버 데이터에 옵션이 있으면 true)
  const [hasOption, setHasOption] = useState(hasOptionData(product));

  // 원본 옵션 데이터 저장 (체크 해제 후 다시 체크할 때 복원용)
  const [originalOptionTypes, setOriginalOptionTypes] = useState(
    normalizeOptionTypes(product),
  );

  // 옵션 타입별 새 옵션값 입력 상태
  const [newOptionValues, setNewOptionValues] = useState({});

  // 편집 중인 옵션값 상태 { typeIdx-valIdx: { name, price, isSoldOut } }
  const [editingOptionValues, setEditingOptionValues] = useState({});

  useEffect(() => {
    setForm(buildInitial(product));
    setErrors({});
    setHasOption(hasOptionData(product));
    setOriginalOptionTypes(normalizeOptionTypes(product));
    setNewOptionValues({});
    setEditingOptionValues({});
    resetUpload();
  }, [productKey]);

  // API 전송용 이미지 객체 배열
  const mergedImageObjects = useMemo(
    () => [
      ...form.productImages,
      ...uploadedImageUrls.map(url => ({ productImgId: null, productImgUrl: url })),
    ],
    [form.productImages, uploadedImageUrls],
  );

  const discountPrice = useMemo(() => {
    const base = toNumber(form.basePrice) + toNumber(form.salesMargin);
    const pct = Math.max(0, Math.min(100, toNumber(form.discountPer)));
    return Math.max(0, Math.floor(base * (1 - pct / 100)));
  }, [form.basePrice, form.salesMargin, form.discountPer]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const removeExistingImage = idx => {
    setForm(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== idx),
    }));
  };

  // 옵션 타입명 변경
  const updateTypeName = (typeIdx, name) => {
    setForm(prev => ({
      ...prev,
      optionTypes: prev.optionTypes.map((type, i) =>
        i === typeIdx ? { ...type, typeName: name } : type,
      ),
    }));
  };

  // 옵션값 추가
  const addOptionValue = typeIdx => {
    const inputValue = newOptionValues[typeIdx] || {
      name: '',
      price: 0,
      isSoldOut: false,
    };
    if (!inputValue.name?.trim()) return;

    setForm(prev => ({
      ...prev,
      optionTypes: prev.optionTypes.map((type, i) => {
        if (i !== typeIdx) return type;
        return {
          ...type,
          optionValues: [
            ...type.optionValues,
            {
              optionValueId: null,
              valueName: inputValue.name.trim(),
              priceAdjustment: Number(inputValue.price) || 0,
              stockStatus: inputValue.isSoldOut ? 0 : 1,
              sortOrder: type.optionValues.length + 1,
              isDeleted: false,
            },
          ],
        };
      }),
    }));
    setNewOptionValues(prev => ({
      ...prev,
      [typeIdx]: { name: '', price: 0, isSoldOut: false },
    }));
  };

  // 옵션값 삭제 (isDeleted로 마킹)
  const removeOptionValue = (typeIdx, valueIdx) => {
    setForm(prev => ({
      ...prev,
      optionTypes: prev.optionTypes.map((type, i) => {
        if (i !== typeIdx) return type;
        return {
          ...type,
          optionValues: type.optionValues.map((val, vi) =>
            vi === valueIdx ? { ...val, isDeleted: true } : val,
          ),
        };
      }),
    }));
  };

  // 옵션값 편집 시작
  const startEditOptionValue = (typeIdx, valueIdx, val) => {
    const key = `${typeIdx}-${valueIdx}`;
    setEditingOptionValues(prev => ({
      ...prev,
      [key]: {
        name: val.valueName,
        price: val.priceAdjustment,
        isSoldOut: val.stockStatus === 0,
      },
    }));
  };

  // 옵션값 편집 취소
  const cancelEditOptionValue = (typeIdx, valueIdx) => {
    const key = `${typeIdx}-${valueIdx}`;
    setEditingOptionValues(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // 옵션값 편집 저장
  const saveEditOptionValue = (typeIdx, valueIdx) => {
    const key = `${typeIdx}-${valueIdx}`;
    const editData = editingOptionValues[key];
    if (!editData || !editData.name?.trim()) return;

    setForm(prev => ({
      ...prev,
      optionTypes: prev.optionTypes.map((type, i) => {
        if (i !== typeIdx) return type;
        return {
          ...type,
          optionValues: type.optionValues.map((val, vi) =>
            vi === valueIdx
              ? {
                  ...val,
                  valueName: editData.name.trim(),
                  priceAdjustment: Number(editData.price) || 0,
                  stockStatus: editData.isSoldOut ? 0 : 1,
                }
              : val,
          ),
        };
      }),
    }));

    // 편집 상태 종료
    cancelEditOptionValue(typeIdx, valueIdx);
  };

  const onOptionValueKeyDown = (e, typeIdx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOptionValue(typeIdx);
    }
  };

  const validateRequired = f => {
    const next = {};
    if (!f.name?.trim()) next.name = ['상품명을 입력하세요.'];
    if (f.basePrice === '' || f.basePrice === null || f.basePrice === undefined)
      next.basePrice = ['공급가를 입력하세요.'];
    if (
      f.salesMargin === '' ||
      f.salesMargin === null ||
      f.salesMargin === undefined
    )
      next.salesMargin = ['판매 마진을 입력하세요.'];
    if (
      f.deliveryPrice === '' ||
      f.deliveryPrice === null ||
      f.deliveryPrice === undefined
    )
      next.deliveryPrice = ['배송비를 입력하세요.'];
    return next;
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (!form.productId) {
      addToast('상품 ID가 없어 수정할 수 없습니다.', 'error');
      return;
    }

    const requiredErrors = validateRequired(form);
    if (Object.keys(requiredErrors).length) {
      setErrors(requiredErrors);
      const firstKey = Object.keys(requiredErrors)[0];
      document
        .querySelector(`[data-field="${firstKey}"]`)
        ?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      addToast('필수 입력값을 채워주세요.', 'error');
      return;
    }

    const html = editorRef.current?.getHTML?.() ?? form.contents ?? '';

    // optionTypes 구성 - hasOption이 false면 null 반환
    const buildOptionTypes = () => {
      if (!hasOption) return null;
      if (!form.optionTypes || form.optionTypes.length === 0) return null;

      const filtered = form.optionTypes
        .filter(type => type.typeName.trim() !== '')
        .map(type => ({
          optionTypeId: type.optionTypeId ?? null,
          typeName: type.typeName,
          isRequired: type.isRequired,
          sortOrder: type.sortOrder,
          isDeleted: type.isDeleted,
          optionValues: type.optionValues.map(val => ({
            optionValueId: val.optionValueId ?? null,
            valueName: val.valueName,
            priceAdjustment: val.priceAdjustment,
            stockStatus: val.stockStatus,
            sortOrder: val.sortOrder,
            isDeleted: val.isDeleted,
          })),
        }));

      return filtered.length > 0 ? filtered : null;
    };

    const payload = {
      name: form.name.trim(),
      contents: html,
      premium: Number(form.premium),
      basePrice: toNumber(form.basePrice),
      salesMargin: toNumber(form.salesMargin),
      discountPer: toNumber(form.discountPer),
      discountPrice: toNumber(discountPrice),
      deliveryPrice: toNumber(form.deliveryPrice || 3000),
      stockStatus: form.stockStatus,
      isAvailable: form.isAvailable,
      productImages: mergedImageObjects,
      optionTypes: buildOptionTypes(),
    };

    try {
      setSubmitting(true);
      await updateProduct(form.productId, payload);
      addToast('상품 수정이 완료되었습니다.', 'success');
      // navigate('/admin/products-list');
    } catch (err) {
      console.error('❌ 상품 수정 실패:', err);
      addToast('상품 수정에 실패했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='rounded-lg border border-gray-400 w-full max-w-[980px] h-full'>
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
              value={form.name}
              onChange={onChange}
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
            <p className='text-red-500 text-xs'>* 최대 80자</p>
            {errors.name && (
              <p className='text-red-500 text-sm w-full mt-2'>
                {errors.name[0]}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-[200px_1fr]'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
            상품 설명
          </div>
          <div className='p-4 pt-0' data-field='contents'>
            <RichEditor
              ref={editorRef}
              initialValue={form.contents}
              variant='full'
              maxChars={20000}
              minHeight={300}
              onUploadImage={handleEditorImageUpload}
            />
          </div>
        </div>
      </div>

      <section className='py-10' data-field='productImgUrls'>
        <p className='font-semibold text-xl mb-4'>이미지 정보</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            썸네일 등록
          </div>
          <div className='p-6 border-b flex flex-wrap items-center gap-3'>
            {form.productImages.map((img, i) => (
              <div key={`exist-${img.productImgId ?? i}`} className='relative'>
                <img
                  src={img.productImgUrl}
                  alt={`exist-${i}`}
                  className='w-[100px] h-[100px] object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => removeExistingImage(i)}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600'
                  title='기존 이미지 삭제'
                >
                  ×
                </button>
              </div>
            ))}

            {uploadedImages.map((url, i) => (
              <div key={`new-${i}`} className='relative'>
                <img
                  src={url}
                  alt={`new-${i}`}
                  className='w-[100px] h-[100px] object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(i)}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600'
                  title='업로드 이미지 제거'
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type='button'
              className='h-[100px] bg-primary-100 w-[100px] rounded-lg flex items-center justify-center'
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                fileInputRef.current?.click();
              }}
              disabled={loading}
            >
              {loading ? '업로드 중…' : <Plus />}
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

      <section className='py-10' data-field='premium'>
        <p className='font-semibold text-xl mb-4'>표시 설정</p>
        <div className='grid grid-cols-[200px_1fr] rounded-t-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            카테고리 선택
          </div>
          <div className='p-6 flex items-center gap-3'>
            <Button
              type='button'
              variant={form.premium === 1 ? 'default' : 'outline'}
              className={`w-fit py-2 px-4 ${form.premium === 1 ? 'text-white' : 'border border-gray-400 text-gray-600'}`}
              onClick={() => setForm(prev => ({ ...prev, premium: 1 }))}
            >
              프리미엄 선물용
            </Button>
            <Button
              type='button'
              variant={form.premium === 0 ? 'default' : 'outline'}
              className={`w-fit py-2 px-4 ${form.premium === 0 ? 'text-white' : 'border border-gray-400 text-gray-600'}`}
              onClick={() => setForm(prev => ({ ...prev, premium: 0 }))}
            >
              일반 상품
            </Button>
          </div>
        </div>

        {/* 품절여부 */}
        <div className='grid grid-cols-[200px_1fr] border border-t-0 border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            품절여부
          </div>
          <div className='p-6 flex items-center gap-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.stockStatus === 0}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    stockStatus: e.target.checked ? 0 : 1,
                  }))
                }
                className='w-5 h-5 accent-primary-500 cursor-pointer'
              />
              <span className='text-gray-700'>품절처리</span>
            </label>
          </div>
        </div>

        {/* 판매여부 */}
        <div className='grid grid-cols-[200px_1fr] rounded-b-lg border border-t-0 border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            판매여부
          </div>
          <div className='p-6 flex items-center gap-3'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.isAvailable === 0}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    isAvailable: e.target.checked ? 0 : 1,
                  }))
                }
                className='w-5 h-5 accent-primary-500 cursor-pointer'
              />
              <span className='text-gray-700'>판매중단</span>
            </label>
          </div>
        </div>
      </section>

      {/* 옵션 추가 체크박스 */}
      <section className='border-b border-gray-500 border-t py-4'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={hasOption}
            onChange={e => {
              setHasOption(e.target.checked);
              if (e.target.checked) {
                // 체크 시 원본 옵션 데이터 복원
                setForm(prev => ({
                  ...prev,
                  optionTypes: originalOptionTypes,
                }));
              } else {
                // 체크 해제 시 현재 옵션 데이터를 원본으로 저장 후 초기화
                setOriginalOptionTypes(form.optionTypes);
                setForm(prev => ({
                  ...prev,
                  optionTypes: defaultOptionTypes,
                }));
                setNewOptionValues({});
                setEditingOptionValues({});
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
          <p className='font-semibold text-xl mb-4'>옵션 등록/수정</p>

          {/* 고정 2개 카테고리 */}
          {form.optionTypes.map((type, typeIdx) => (
            <div
              key={typeIdx}
              className={`grid grid-cols-[200px_1fr] border border-gray-400 ${
                typeIdx === 0 ? 'rounded-t-lg' : 'border-t-0'
              } ${typeIdx === form.optionTypes.length - 1 ? 'rounded-b-lg' : ''}`}
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
                {type.optionValues.map((val, valIdx) => {
                  if (val.isDeleted) return null;
                  const editKey = `${typeIdx}-${valIdx}`;
                  const isEditing = !!editingOptionValues[editKey];
                  const editData = editingOptionValues[editKey];

                  return (
                    <div
                      key={`val-${val.optionValueId ?? valIdx}`}
                      className='flex items-center gap-3 text-sm'
                    >
                      {isEditing ? (
                        /* 편집 모드 */
                        <>
                          <div className='flex flex-1 items-center gap-2 max-w-[550px]'>
                            <input
                              type='text'
                              value={editData.name}
                              onChange={e =>
                                setEditingOptionValues(prev => ({
                                  ...prev,
                                  [editKey]: {
                                    ...prev[editKey],
                                    name: e.target.value,
                                  },
                                }))
                              }
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveEditOptionValue(typeIdx, valIdx);
                                }
                              }}
                              className='border rounded-md p-2 flex-1 max-w-[200px] focus:outline-primary-200 border-gray-400'
                              placeholder='옵션명'
                            />
                            <input
                              type='number'
                              value={editData.price}
                              onChange={e =>
                                setEditingOptionValues(prev => ({
                                  ...prev,
                                  [editKey]: {
                                    ...prev[editKey],
                                    price: e.target.value,
                                  },
                                }))
                              }
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  saveEditOptionValue(typeIdx, valIdx);
                                }
                              }}
                              className='border rounded-md p-2 w-[120px] focus:outline-primary-200 border-gray-400'
                              placeholder='추가금액'
                            />
                            <label className='flex items-center gap-1 cursor-pointer'>
                              <input
                                type='checkbox'
                                checked={editData.isSoldOut}
                                onChange={e =>
                                  setEditingOptionValues(prev => ({
                                    ...prev,
                                    [editKey]: {
                                      ...prev[editKey],
                                      isSoldOut: e.target.checked,
                                    },
                                  }))
                                }
                                className='w-4 h-4 accent-primary-500 cursor-pointer'
                              />
                              <span className='text-gray-700'>품절</span>
                            </label>
                          </div>
                          <button
                            type='button'
                            onClick={() => saveEditOptionValue(typeIdx, valIdx)}
                            className='text-green-600 hover:text-green-800 text-sm font-medium px-2'
                          >
                            저장
                          </button>
                          <button
                            type='button'
                            onClick={() =>
                              cancelEditOptionValue(typeIdx, valIdx)
                            }
                            className='text-gray-500 hover:text-gray-700 text-sm'
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        /* 보기 모드 */
                        <>
                          <div className='flex flex-1 items-center border rounded-md p-2 border-gray-400 max-w-[550px]'>
                            <p className='flex-1 max-w-[300px] text-gray-600'>
                              {valIdx + 1}) {val.valueName}
                              {val.optionValueId && (
                                <span className='ml-2 text-xs text-blue-500'>
                                  (기존)
                                </span>
                              )}
                            </p>
                            <p className='w-[150px] text-gray-600 whitespace-nowrap'>
                              옵션추가금 :{' '}
                              {val.priceAdjustment.toLocaleString()}원
                            </p>
                            {val.stockStatus === 0 && (
                              <span className='text-sm text-red-500 ml-2'>
                                품절
                              </span>
                            )}
                          </div>
                          <button
                            type='button'
                            onClick={() =>
                              startEditOptionValue(typeIdx, valIdx, val)
                            }
                            className='text-gray-500 hover:text-blue-600 text-lg'
                            title='수정'
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            type='button'
                            onClick={() => removeOptionValue(typeIdx, valIdx)}
                            className='text-gray-500 hover:text-gray-700 text-xl'
                            title='삭제'
                          >
                            ×
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className='py-10'>
        <div className='rounded-lg border border-gray-400'>
          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100 font-semibold px-6 py-6 border-b'>
              <div className='flex flex-col gap-3'>
                <p>공급가</p> <p>+</p> <p>판매 마진</p> <p>+</p> <p>할인(%)</p>
              </div>
            </div>

            <div className='p-4 border-b w-full max-w-[980px]'>
              <div className='flex flex-col items-stretch gap-3'>
                <div className='flex items-center gap-2'>
                  <input
                    name='basePrice'
                    type='number'
                    inputMode='decimal'
                    value={form.basePrice}
                    onChange={onChange}
                    className='w-[300px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                    data-field='basePrice'
                    placeholder='공급가'
                  />
                  <span className='shrink-0'>KRW</span>
                </div>

                {/* + 구분선 */}
                <div className='h-5 grid place-items-center w-full max-w-[300px]'>
                  <span>+</span>
                </div>

                {/* 판매 마진 (input + KRW) */}
                <div className='flex items-center gap-2'>
                  <input
                    name='salesMargin'
                    type='number'
                    inputMode='decimal'
                    value={form.salesMargin}
                    onChange={onChange}
                    className='w-[300px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                    data-field='salesMargin'
                    placeholder='판매 마진'
                  />
                  <span className='shrink-0'>KRW</span>
                </div>

                <div className='h-5 grid place-items-center w-full max-w-[300px]'>
                  <span>+</span>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    name='discountPer'
                    type='number'
                    inputMode='decimal'
                    min={0}
                    max={100}
                    value={form.discountPer}
                    onChange={onChange}
                    className='w-[300px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                    data-field='discountPer'
                    placeholder='할인율'
                  />
                  <span className='shrink-0'>%</span>
                </div>
              </div>
              <div className='w-full mt-2' data-field='deliveryPrice'>
                {errors.basePrice && (
                  <p className='text-red-500 text-sm'>{errors.basePrice[0]}</p>
                )}
                {errors.salesMargin && (
                  <p className='text-red-500 text-sm'>
                    {errors.salesMargin[0]}
                  </p>
                )}
                {errors.deliveryPrice && (
                  <p className='text-red-500 text-sm'>
                    {errors.deliveryPrice[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-[200px_1fr]'>
            <div className='bg-primary-100 font-semibold px-6 py-4 border-b'>
              판매 가격
            </div>
            <div className='p-4 border-b flex items-center gap-3 w-full max-w-[980px]'>
              <input
                name='discountPrice'
                value={discountPrice}
                readOnly
                className='w-full max-w-[300px] border rounded-md p-2 bg-gray-100 text-gray-700 border-gray-300'
              />
              <p>KRW</p>
              <span className='text-xs text-gray-500'>(자동 계산)</span>
            </div>
          </div>
        </div>
      </section>

      <div className='flex justify-center'>
        <button
          type='submit'
          className='w-fit px-20 py-4 bg-primary-200 text-white rounded-md disabled:opacity-60'
          disabled={submitting}
        >
          {submitting ? '수정 중…' : '수정'}
        </button>
      </div>
    </form>
  );
}
