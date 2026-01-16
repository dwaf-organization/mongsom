import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import { getFirstThumb } from '../../../utils/dateUtils';

export default function InquireListTable({ rows, loading, data }) {
  console.log('🚀 ~ InquireListTable ~ data:', data);
  const safeRows = Array.isArray(rows) ? rows : [];
  const navigate = useNavigate();

  return (
    <section className='py-6'>
      <div className='overflow-hidden pt-2'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col style={{ width: 160 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
            </colgroup>

            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr className='text-center'>
                <th className='px-6 py-3 uppercase tracking-wider'>순번</th>
                <th className='px-3 py-3 uppercase tracking-wider text-left'>
                  이름
                </th>
                <th className='px-6 py-3 uppercase tracking-wider whitespace-nowrap'>
                  이메일
                </th>
                <th className='px-6 py-3 uppercase tracking-wider'>전화번호</th>
                <th className='px-6 py-3 uppercase tracking-wider text-center'>
                  카테고리
                </th>
                <th className='px-6 py-3 uppercase tracking-wider text-center'>
                  문의상품
                </th>
                <th className='px-6 py-3 uppercase tracking-wider whitespace-nowrap'>
                  희망가격
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y'>
              {data.map(inquiry => {
                return (
                  <tr
                    key={inquiry.inquiryId}
                    className='text-center cursor-pointer  hover:bg-gray-100'
                  >
                    <td className='px-6 py-3 text-sm text-gray-900'>
                      <div className='flex flex-col gap-1 items-center'>
                        <p className='font-medium'>{inquiry.inquiryId}</p>
                      </div>
                    </td>

                    <td className='px-3 py-3 text-sm text-gray-900'>
                      <div className='flex items-center gap-2'>
                        {inquiry.companyName}
                      </div>
                    </td>

                    <td className='px-6 py-3 text-center text-sm text-gray-900'>
                      {inquiry.email}
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-center text-sm'>
                      {inquiry.phone}
                    </td>

                    <td className='px-6 py-3 whitespace-nowrap text-sm'>
                      {inquiry.category}
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-sm'>
                      {inquiry.name}
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-sm'>
                      {inquiry.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
