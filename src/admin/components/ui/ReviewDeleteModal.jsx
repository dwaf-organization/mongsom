import React, { useState } from 'react';
import { deleteReview } from '../../api/reveiw/index';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';

export default function ReviewDeleteModal({ reviewId, onSuccess }) {
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteReview(reviewId);
      if (response.code === 1) {
        addToast('리뷰가 삭제되었습니다.', 'success');
        closeModal();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      addToast('리뷰 삭제에 실패했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl p-6 w-[320px]'>
      <div className='flex flex-col items-center text-center'>
        <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4'>
          <svg
            className='w-6 h-6 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </div>

        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          리뷰를 삭제하시겠습니까?
        </h3>
        <p className='text-sm text-gray-500 mb-6'>
          삭제된 리뷰는 복구할 수 없습니다.
        </p>

        <div className='flex gap-3 w-full'>
          <button
            onClick={closeModal}
            disabled={isDeleting}
            className='flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50'
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50'
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
