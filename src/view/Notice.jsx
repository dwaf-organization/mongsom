import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { notice } from '../data/Notice';

export default function Notice() {
  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-xl text-start font-semibold font-pretendard border-b-2 border-gray-700 pb-4'>
        공지사항
      </h2>
      <table className='w-full bg-secondary-100'>
        <thead>
          <tr className='flex justify-between border-b border-gray-400 py-5'>
            <th className='text-cneter font-montserrat font-medium w-full max-w-[100px]'>
              NO
            </th>
            <th className='text-cneter  font-medium w-full'>제목</th>
            <th className='text-cneter font-medium w-full max-w-[100px]'>
              글쓴이
            </th>
            <th className='text-cneter font-medium w-full max-w-[100px]'>
              날짜
            </th>
          </tr>
        </thead>
        <tbody>
          {notice.map((item, index) => (
            <tr
              key={item.id || index}
              className='flex justify-between border-b border-gray-400 py-5'
            >
              <td className='text-cneter font-montserrat font-medium w-full max-w-[100px]'>
                {item.id || index + 1}
              </td>
              <td className='text-start font-montserrat font-medium w-full pl-4'>
                {item.title}
              </td>
              <td className='text-cneter font-montserrat font-medium w-full max-w-[100px]'>
                {item.writer}
              </td>
              <td className='text-cneter font-montserrat font-medium w-full max-w-[100px]'>
                {item.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </InnerPaddingSectionWrapper>
  );
}
