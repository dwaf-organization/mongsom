import { useEffect } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getQnAList } from '../api/qna';
import Pagination from '../components/ui/Pagination';
import { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

export default function QnA() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const [pagination, setPagination] = useState({});
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleRowClick = qnaCode => {
    navigate(`/qna/${qnaCode}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getQnAList({ page, size: 10 });
      if (response.code === 1) {
        setPagination(response.data.pagination);
        setData(response.data.qnaList);
      }
    };
    fetchData();
  }, [page]);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='font-semibold pb-4'>QnA</h2>

      <table className='w-full'>
        <thead className='border-y border-gray-50 w-full'>
          <tr className='w-full'>
            <th className='px-4 py-2'>NO</th>
            <th className='px-4 py-2'>상품명</th>
            <th className='px-4 py-2'>제목</th>
            <th className='px-4 py-2'>작성자</th>
            <th className='px-4 py-2'>답변상태</th>
            <th className='px-4 py-2'>작성일</th>
          </tr>
        </thead>

        <tbody className='w-full'>
          {data.map((item, index) => (
            <tr
              key={item.qnaCode}
              className='border-b border-gray-300 w-full text-sm cursor-pointer hover:bg-primary-100/60'
              onClick={() => handleRowClick(item.qnaCode)}
            >
              <td className='px-4 py-2 text-center' colSpan={1}>
                {index + 1}
              </td>
              <td className='px-4 py-2 text-center' colSpan={1}>
                {item.productName}
              </td>
              <td className='px-4 py-2 text-center' colSpan={1}>
                {item.qnaTitle}
              </td>
              <td className='px-4 py-2 text-center' colSpan={1}>
                {item.qnaWriter}
              </td>
              <td className='px-4 py-2 text-center' colSpan={1}>
                {item.answerStatus}
              </td>
              <td className='px-4 py-2 text-center' colSpan={1}>
                {formatDate(item.createdDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination totalPage={pagination.totalPages} />
    </InnerPaddingSectionWrapper>
  );
}
