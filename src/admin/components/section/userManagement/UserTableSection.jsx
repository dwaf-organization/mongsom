import { user } from '../../../data/User';
import { Button } from '../../ui/button';

export default function UserTableSection() {
  return (
    <section className='py-6'>
      <table className='w-full'>
        <thead className='border-b border-gray-500'>
          <tr className='text-center'>
            <th>이름</th>
            <th>아이디</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>채팅</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {user.map(user => (
            <tr key={user.id} className='border-b border-gray-400'>
              <td className='py-4'>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td className='flex justify-center py-4'>
                <Button>채팅하기</Button>
              </td>
              <td className=' py-4'>
                <button className='text-red-500'>회원삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
