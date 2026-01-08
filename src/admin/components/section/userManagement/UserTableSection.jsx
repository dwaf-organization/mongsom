import { useState } from 'react';
import DeleteUserModal from '../../ui/DeleteUserModal';
import { useModal } from '../../../context/ModalContext';
import { Button } from '../../ui/button';
import { chargeMileage } from '../../../api/user';
import { useToast } from '../../../context/ToastContext';

export default function UserTableSection({ userList }) {
  const { openModal } = useModal();
  const [mileageInputs, setMileageInputs] = useState({});
  const { addToast } = useToast();

  const handleDelete = async userCode => {
    openModal(<DeleteUserModal userCode={userCode} />);
  };

  const handleMileageChange = (userCode, value) => {
    setMileageInputs(prev => ({
      ...prev,
      [userCode]: value,
    }));
  };

  const handleChargeButton = async (e, userCode) => {
    e.preventDefault();
    const mileage = mileageInputs[userCode];
    if (!mileage) return;

    const response = await chargeMileage(userCode, Number(mileage));
    addToast('마일리지가 충전되었습니다.', 'success');
    console.log('🚀 ~ handleChargeButton ~ response:', response);

    setMileageInputs(prev => ({
      ...prev,
      [userCode]: '',
    }));
  };

  return (
    <section className='py-6'>
      <table className='w-full'>
        <colgroup>
          <col className='w-[10%]' />
          <col className='w-[10%]' />
          <col className='w-[10%]' />
          <col className='w-[10%]' />
          <col className='w-[30%]' />
          <col className='w-[20%]' />
        </colgroup>
        <thead className='border-y border-gray-500'>
          <tr className='text-center  '>
            <th className='py-4'>회원 코드</th>
            <th className='py-4'>이름</th>
            <th className='py-4'>아이디</th>
            <th className='py-4'>전화번호</th>
            <th className='py-4'>이메일</th>
            <th className='py-4'>마일리지</th>
            <th className='py-4'>삭제</th>
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
                <div>
                  <p>보유마일리지:5,000원 {user.mileage}</p>
                </div>
                <form
                  className='flex items-center gap-2 justify-center mt-2'
                  onSubmit={e => handleChargeButton(e, user.userCode)}
                >
                  <input
                    type='number'
                    className='border rounded border-gray-400 max-w-28 p-1'
                    value={mileageInputs[user.userCode] || ''}
                    onChange={e =>
                      handleMileageChange(user.userCode, e.target.value)
                    }
                  />
                  <Button
                    type='submit'
                    className='bg-primary-200 text-white text-sm w-fit'
                  >
                    충전
                  </Button>
                </form>
              </td>

              <td className=' py-4'>
                <Button
                  className='bg-red-100'
                  onClick={() => handleDelete(user.userCode)}
                >
                  회원삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
