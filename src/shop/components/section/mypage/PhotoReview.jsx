import { useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';

export default function PhotoReview({ onUrlsChange }) {
  const fileInputRef = useRef(null);
  const {
    handleFileInput,
    uploadedImageUrls,
    uploadedImages,
    loading,
    handleRemoveImage,
  } = useImageUpload('review_images');

  useEffect(() => {
    onUrlsChange?.(uploadedImageUrls || []);
  }, [uploadedImageUrls, onUrlsChange]);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  // ✅ 3장 제한 가드 + 단일 파일만 허용
  const handleSingleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const remain = 3 - uploadedImages.length;
    if (remain <= 0) {
      // 이미 3장 등록됨
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // useImageUpload의 handleFileInput이 "이벤트"를 받도록 되어 있으므로
    // 단일 파일만 담긴 FileList로 교체해서 전달
    const dt = new DataTransfer();
    dt.items.add(file);
    const patchedEvent = {
      ...e,
      target: {
        ...e.target,
        files: dt.files,
      },
    };
    handleFileInput(patchedEvent);

    // input 초기화
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className='flex py-10 gap-4 border-b border-gray-400'>
      <p className='font-semibold text-left pb-4 whitespace-nowrap mr-[100px]'>
        사진 첨부
      </p>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            className={`w-fit py-2 ${
              loading
                ? 'text-gray-700 font-semibold bg-white border-gray-500 hover:bg-white disabled:bg-white disabled:text-gray-700'
                : uploadedImages.length >= 3
                  ? 'text-gray-500 font-semibold bg-white border-gray-300 hover:bg-white disabled:bg-white disabled:text-gray-500'
                  : 'text-gray-500 bg-white'
            }`}
            variant='outline'
            onClick={handleButtonClick}
            disabled={loading || uploadedImages.length >= 3}
          >
            {loading
              ? '업로드 중...'
              : uploadedImages.length >= 3
                ? '최대 3장까지 등록 가능'
                : '사진 첨부'}
          </Button>
          <p className='text-sm'>{uploadedImages.length}/3</p>
        </div>

        {/* ⛔ multiple 제거: 한 번에 여러 장 선택 불가 */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleSingleFile}
          className='hidden'
        />

        <div className='flex items-center gap-4'>
          {uploadedImages.map((url, index) => (
            <div key={index} className='relative group'>
              <img
                src={url}
                alt={`reviewphoto-${index}`}
                className='w-[70px] h-[70px] object-cover rounded'
              />
              <button
                className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors'
                aria-label='이미지 삭제'
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
