import { deleteUser } from '../../../api/user';
import { useToast } from '../../../context/ToastContext';
import DeleteUserModal from '../../ui/DeleteUserModal';
import { useModal } from '../../../context/ModalContext';

export default function UserTableSection({ userList }) {
  const { openModal } = useModal();

  const handleDelete = async userCode => {
    openModal(<DeleteUserModal userCode={userCode} />);
    // const res = await deleteUser(userCode);
    // console.log('🚀 ~ handleDelete ~ res:', res);
    // if (res.code === 1) {
    //   addToast('회원이 삭제되었습니다.', 'success');
    // } else {
    //   addToast(res?.data || '회원 삭제에 실패했습니다.', 'error');
    // }
  };

  return (
    <section className='py-6'>
      <table className='w-full'>
        <thead className='border-b border-gray-500'>
          <tr className='text-center'>
            <th>회원 코드</th>
            <th>이름</th>
            <th>아이디</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {userList.map(user => (
            <tr key={user.userCode} className='border-b border-gray-400'>
              <td className='py-4'>{user.userCode}</td>
              <td className='py-4'>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>

              <td className=' py-4'>
                <button
                  className='text-red-500'
                  onClick={() => handleDelete(user.userCode)}
                >
                  회원삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
