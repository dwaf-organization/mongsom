import { Button } from './button';
import { useModal } from '../../context/ModalContext';
import { deleteUser } from '../../api/user';
import { useToast } from '../../context/ToastContext';

export default function DeleteUserModal({ userCode }) {
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const handleCancel = () => {
    closeModal();
  };
  const handleDelete = async () => {
    const res = await deleteUser(userCode);
    if (res.code === 1) {
      addToast('회원이 삭제되었습니다.', 'success');
      closeModal();
    } else {
      addToast(res?.data || '회원 삭제에 실패했습니다.', 'error');
    }
    closeModal();
  };
  return (
    <div className='py-5 px-10'>
      <h2 className='text-xl font-semibold pb-4'>회원 삭제</h2>
      <p>회원을 삭제하시겠습니까? </p>
      <p className='text-red-500 py-2'>* 회원 삭제 후 복구가 불가능합니다.</p>
      <div className='flex items-center justify-center gap-2'>
        <Button onClick={handleCancel} className='w-fit py-2 px-6'>
          취소
        </Button>
        <Button
          onClick={handleDelete}
          variant='outline'
          className='w-fit py-2 px-6'
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
