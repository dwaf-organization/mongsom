import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import RichEditor from '../../ui/RichEditor';
import 'quill/dist/quill.snow.css';
import Plus from '../../../assets/icons/Plus';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';
import { updateProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const toNumber = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const normalizeImages = imgs => {
  if (!imgs) return [];
  if (Array.isArray(imgs)) return imgs.filter(Boolean);
  if (typeof imgs === 'string') return imgs ? [imgs] : [];
  return [];
};
const normalizeOptions = p =>
  Array.isArray(p?.options)
    ? p.options.map(o => ({
        optId: o.optId ?? o.id ?? null,
        optName: o.optName ?? o.name ?? o.optionName ?? '',
      }))
    : Array.isArray(p?.optNames)
      ? p.optNames.map(nm => ({ optId: null, optName: String(nm) }))
      : [];

export default function EditProductInfoSection({ product }) {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  // 업로드 훅
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
      price: String(p?.price ?? ''),
      salesMargin: String(p?.salesMargin ?? ''),
      discountPer: String(p?.discountPer ?? ''),
      deliveryPrice: String(p?.deliveryPrice ?? 3000),
      existingImages: normalizeImages(p?.productImgUrls ?? p?.images),
      options: normalizeOptions(p),
    }),
    [],
  );

  const [form, setForm] = useState(buildInitial(product));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [newOptName, setNewOptName] = useState('');

  useEffect(() => {
    setForm(buildInitial(product));
    setErrors({});
    setNewOptName('');
    resetUpload();
  }, [productKey]);

  const mergedImageUrls = useMemo(
    () => [...form.existingImages, ...uploadedImageUrls],
    [form.existingImages, uploadedImageUrls],
  );

  const discountPrice = useMemo(() => {
    const base = toNumber(form.price) + toNumber(form.salesMargin);
    const pct = Math.max(0, Math.min(100, toNumber(form.discountPer)));
    return Math.max(0, Math.floor(base * (1 - pct / 100)));
  }, [form.price, form.salesMargin, form.discountPer]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const removeExistingImage = idx => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx),
    }));
  };

  const addOption = () => {
    const v = newOptName.trim();
    if (!v) return;
    setForm(prev => ({
      ...prev,
      options: [...prev.options, { optId: null, optName: v }],
    }));
    setNewOptName('');
  };
  const changeOptionName = (idx, value) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.map((o, i) =>
        i === idx ? { ...o, optName: value } : o,
      ),
    }));
  };

  const validateRequired = f => {
    const next = {};
    if (!f.name?.trim()) next.name = ['상품명을 입력하세요.'];
    if (f.price === '' || f.price === null || f.price === undefined)
      next.price = ['공급가를 입력하세요.'];
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

    const payload = {
      name: form.name.trim(),
      contents: html,
      premium: Number(form.premium),
      price: toNumber(form.price),
      salesMargin: toNumber(form.salesMargin),
      discountPer: toNumber(form.discountPer),
      discountPrice: toNumber(discountPrice),
      deliveryPrice: toNumber(form.deliveryPrice || 3000),
      productImgUrls: mergedImageUrls,
      options: form.options.map(o => ({
        optId: o.optId ?? null,
        optName: String(o.optName || '').trim(),
      })),
    };

    try {
      setSubmitting(true);
      await updateProduct(form.productId, payload);
      addToast('상품 수정이 완료되었습니다.', 'success');
      navigate('/admin/products-list');
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
              value={form.name}
              onChange={onChange}
              className='w-full max-w-[600px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
            />
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
            {form.existingImages.map((url, i) => (
              <div key={`exist-${i}`} className='relative'>
                <img
                  src={url}
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
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            상품분류 선택
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
      </section>

      <section className='py-10' data-field='options'>
        <p className='font-semibold text-xl mb-4'>옵션 등록/수정</p>
        <div className='grid grid-cols-[200px_1fr] rounded-lg border border-gray-400'>
          <div className='bg-primary-100 font-semibold px-6 py-4 border-b whitespace-nowrap'>
            옵션
          </div>
          <div className='p-6 flex flex-col gap-4'>
            <div className='flex items-start gap-3'>
              <input
                type='text'
                value={newOptName}
                placeholder='새 옵션명을 입력하세요'
                className='border rounded-md p-2 w-full max-w-[500px] focus:outline-primary-200 border-gray-400'
                onChange={e => setNewOptName(e.target.value)}
              />
              <Button
                type='button'
                className='w-fit py-2 px-4'
                onClick={addOption}
              >
                + 등록
              </Button>
            </div>

            {form.options.length === 0 && (
              <p className='text-gray-500 text-sm'>등록된 옵션이 없습니다.</p>
            )}
            <div className='flex flex-col gap-2'>
              {form.options.map((o, idx) => (
                <div
                  key={`${o.optId ?? 'new'}-${idx}`}
                  className='flex items-center gap-3'
                >
                  <input
                    type='text'
                    value={o.optName}
                    onChange={e => changeOptionName(idx, e.target.value)}
                    className='border rounded-md p-2 w-full max-w-[500px] focus:outline-primary-200 border-gray-400'
                  />
                  <span className='text-xs text-gray-500'>
                    {o.optId ? `기존옵션` : '새 옵션'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                    name='price'
                    type='number'
                    inputMode='decimal'
                    value={form.price}
                    onChange={onChange}
                    className='w-[300px] border rounded-md p-2 focus:outline-primary-200 border-gray-400'
                    data-field='price'
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
                {errors.price && (
                  <p className='text-red-500 text-sm'>{errors.price[0]}</p>
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
