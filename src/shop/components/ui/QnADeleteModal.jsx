import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { deleteQnA } from '../../api/qna';
import { useModal } from '../../context/ModalContext';

export default function QnADeleteModal({ qnaCode }) {
  const { userCode } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const response = await deleteQnA({
      qnaCode: qnaCode,
      userCode: userCode,
    });
    if (response.code == 1) {
      addToast('삭제되었습니다.', 'success');
      navigate('/qna');
      onClose();
    }
  };
  const onClose = () => {
    closeModal();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className='relative bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 animate-in fade-in zoom-in duration-200'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X size={20} />
        </button>

        <h3 className='text-center text-lg font-bold text-gray-900 mb-2'>
          QnA 삭제
        </h3>
        <p className='text-center text-gray-500 mb-6'>
          정말 이 QnA를 삭제하시겠습니까?
          <br />
          <span className='text-sm text-red-100'>
            * 삭제된 글은 복구할 수 없습니다.
          </span>
        </p>

        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1 h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50'
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            className='flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white'
            onClick={handleDelete}
          >
            삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
}
