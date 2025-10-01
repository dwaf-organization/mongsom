import { useModal } from '../../../context/ModalContext';
import { Button } from '../button';
import { deleteUser } from '../../../api/myPage';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DeleteUserModal() {
  const { userCode } = useAuth();
  const { addToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { closeModal } = useModal();
  const handleCancel = () => {
    closeModal();
  };
  const handleDelete = async () => {
    const res = await deleteUser(userCode);
    if (res === 1) {
      addToast('회원 탈퇴가 완료되었습니다.', 'success');
      logout();
      closeModal();
      navigate('/login');
    } else {
      addToast(res?.data || '회원 탈퇴에 실패했습니다.', 'error');
    }
  };
  return (
    <div className='space-y-4 rounded-lg py-10 px-10'>
      <p>회원 탈퇴 하시겠습니까?</p>
      <div className='flex justify-end gap-2'>
        <Button onClick={handleCancel}>취소</Button>
        <Button variant='outline' onClick={handleDelete}>
          탈퇴
        </Button>
      </div>
    </div>
  );
}
