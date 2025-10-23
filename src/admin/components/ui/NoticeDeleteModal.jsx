import { Button } from './button';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { deleteNotice } from '../../api/notice';

export default function NoticeDeleteModal({ noticeId }) {
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleCancel = () => {
    closeModal();
  };
  const handleConfirm = async () => {
    const res = await deleteNotice(noticeId);
    console.log('확인');
    if (res.code === 1) {
      addToast('공지 삭제가 완료되었습니다.');
      closeModal(navigate('/notices'));
    } else {
      addToast(res?.data || '주문 취소에 실패했습니다.', 'error');
      closeModal();
    }
  };
  return (
    <div className='space-y-4 rounded-lg py-4 px-10'>
      <p className='text-xl font-semibold'>공지 삭제</p>
      <p>공지를 삭제 하시겠습니까?</p>
      <p className='text-sm text-red-500'>
        *주문을 취소후 상태값 변경은 불가능합니다.
        <br /> 주문 취소 진행 후 페이지 새로고침을 해주세요.
      </p>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel}>취소</Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </div>
  );
}
