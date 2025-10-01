import { useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { useImageUpload } from '../../../../hooks/useImageUpload';

// props: onUrlsChange(urls: string[])
export default function PhotoReview({ onUrlsChange }) {
  const fileInputRef = useRef(null);
  const {
    handleFileInput,
    uploadedImageUrls,
    uploadedImages,
    loading,
    handleRemoveImage,
  } = useImageUpload('review_images');

  // 업로드된 URL이 바뀔 때마다 부모에게 알려주기
  useEffect(() => {
    onUrlsChange?.(uploadedImageUrls || []);
  }, [uploadedImageUrls, onUrlsChange]);

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  return (
    <section className='flex py-10 gap-4 border-b border-gray-400'>
      <p className='font-semibold text-left pb-4 whitespace-nowrap mr-[100px] '>
        사진 첨부
      </p>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            className={`w-fit py-2  text${
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

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileInput}
          className='hidden'
        />

        {/* 업로드된 이미지들 표시 */}
        <div className='flex items-center gap-4'>
          {uploadedImages.length > 0 &&
            uploadedImages.map((url, index) => (
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
