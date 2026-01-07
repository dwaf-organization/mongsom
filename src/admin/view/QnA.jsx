import { useEffect, Fragment } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getQnAList, getQnADetail, answerQnA } from '../api/qna';
import Pagination from '../components/ui/Pagination';
import { useState } from 'react';
import { formatDate } from '../utils/dateUtils';
import { maskName } from '../../admin/utils/dateUtils';
import { Lock } from 'lucide-react';
export default function QnA() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const [pagination, setPagination] = useState({});
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedData, setExpandedData] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const navigate = useNavigate();

  const handleAnswerSubmit = async qnaCode => {
    if (!answerInput.trim()) return;

    const response = await answerQnA({ qnaCode, answerContents: answerInput });
    if (response.code === 1) {
      // 답변 등록 후 상태 업데이트
      setData(prev =>
        prev.map(item =>
          item.qnaCode === qnaCode
            ? { ...item, answerStatus: '답변완료' }
            : item,
        ),
      );
      setExpandedData(prev => ({ ...prev, answerContents: answerInput }));
      setAnswerInput('');
    }
  };

  const handleRowClick = async (qnaCode, item) => {
    // 이미 열린 행을 다시 클릭하면 닫기
    if (expandedRow === qnaCode) {
      setExpandedRow(null);
      setExpandedData(null);
      return;
    }

    const response = await getQnADetail(qnaCode);
    console.log('🚀 ~ handleRowClick ~ response:', response);
    if (response.code === 1) {
      setExpandedRow(qnaCode);
      setExpandedData(response.data);
    }
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
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>QnA</h2>

      <table className='w-full table-fixed'>
        <thead className='border-y border-gray-50 w-full text-sm'>
          <tr className='w-full'>
            <th className='px-4 py-2 w-[10%]'>답변상태</th>
            <th className='px-4 py-2 w-[35%]'>제목</th>
            <th className='px-4 py-2 w-[25%]'>상품명</th>
            <th className='px-4 py-2 w-[15%]'>작성자</th>
            <th className='px-4 py-2 w-[15%]'>작성일</th>
          </tr>
        </thead>

        <tbody className='w-full'>
          {data.map((item, index) => (
            <Fragment key={item.qnaCode}>
              <tr
                className={`border-b border-gray-300 w-full text-sm cursor-pointer hover:bg-primary-100/60 ${expandedRow === item.qnaCode ? 'bg-primary-100' : ''}`}
                onClick={() => handleRowClick(item.qnaCode, item)}
              >
                <td
                  className='px-4 py-2 text-center whitespace-nowrap'
                  colSpan={1}
                >
                  {item.answerStatus}
                </td>

                <td className='px-4 py-2 text-left' colSpan={1}>
                  <div className='flex items-center gap-1'>
                    {item.qnaTitle}
                    {item.lockStatus === 1 && <Lock size={12} />}
                  </div>
                </td>
                <td className='px-4 py-2 text-center' colSpan={1}>
                  {item.productName}
                </td>
                <td className='px-4 py-2 text-center' colSpan={1}>
                  {maskName(item.qnaWriter)}
                </td>

                <td className='px-4 py-2 text-center' colSpan={1}>
                  {formatDate(item.createdDate)}
                </td>
              </tr>
              {expandedRow === item.qnaCode && expandedData && (
                <tr key={`${item.qnaCode}-expanded`} className='bg-primary-100'>
                  <td></td>
                  <td className='px-4 py-4' colSpan={4}>
                    <p className='text-sm text-gray-700 whitespace-pre-wrap mb-4'>
                      {expandedData.qnaContents}
                    </p>
                    {item.answerStatus === '답변완료' ? (
                      <div className='border-t border-gray-400 pt-4'>
                        <span className='text-xs bg-gray-50 text-white px-2 py-1 whitespace-nowrap'>
                          답변
                        </span>
                        <p className='text-sm text-gray-700 whitespace-pre-wrap mt-2'>
                          {expandedData.answerContents}
                        </p>
                      </div>
                    ) : (
                      <div
                        className='flex items-center gap-2 border-t border-gray-400 pt-4'
                        onClick={e => e.stopPropagation()}
                      >
                        <span className='text-xs bg-gray-50 text-white px-2 py-1 whitespace-nowrap'>
                          답변
                        </span>
                        <input
                          type='text'
                          className='flex-1 px-3 py-2 border border-gray-300 rounded text-sm'
                          placeholder='답변을 작성해주세요.'
                          value={answerInput}
                          onChange={e => setAnswerInput(e.target.value)}
                        />
                        <button
                          className='px-4 py-2 bg-primary-200 text-white text-sm rounded whitespace-nowrap'
                          onClick={() => handleAnswerSubmit(item.qnaCode)}
                        >
                          답변 등록
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      <Pagination totalPage={pagination.totalPages} />
    </InnerPaddingSectionWrapper>
  );
}
