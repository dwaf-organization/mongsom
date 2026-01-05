import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProductQnAList } from '../.././../api/qna';
// import Pagination from '../components/ui/Pagination';
import { useState } from 'react';
import { formatDate } from '../../../../shop/utils/dateUtils';
import { useParams } from 'react-router-dom';
import Pagination from '../Pagination';
import { deleteQnA } from '../../../api/qna';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { Lock } from 'lucide-react';

export default function QnATab({ product }) {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  console.log('🚀 ~ QnATab ~ productId:', id);
  const page = Number(searchParams.get('page')) || 0;
  const [pagination, setPagination] = useState({});
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const { userCode } = useAuth();
  const { addToast } = useToast();

  const handleRowClick = (qnaCode, item) => {
    // 비공개 글(lockStatus === 1)이고 본인이 작성한 글이 아닌 경우
    if (item.lockStatus === 1 && item.userCode !== userCode) {
      alert('본인만 확인할 수 있는 글입니다.');
      return;
    }
    setExpandedRow(expandedRow === qnaCode ? null : qnaCode);
  };

  const fetchData = async () => {
    const response = await getProductQnAList({
      productCode: id,
      page,
      size: 10,
    });
    console.log('🚀 ~ fetchData ~ response:', response);
    if (response.code === 1) {
      setPagination(response.data.pagination);
      setData(response.data.qnaList);
    }
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   const response = await getProductQnAList({
    //     productCode: id,
    //     page,
    //     size: 10,
    //   });
    //   console.log('🚀 ~ fetchData ~ response:', response);
    //   if (response.code === 1) {
    //     setPagination(response.data.pagination);
    //     setData(response.data.qnaList);
    //   }
    // };
    fetchData();
  }, [page]);

  const handleDelete = async qnaCode => {
    const response = await deleteQnA({
      qnaCode: qnaCode,
      userCode: userCode,
    });
    if (response.code == 1) {
      addToast('삭제되었습니다.', 'success');
      fetchData();
    }
  };

  const handleQnACreation = () => {
    navigate(
      `/qna/create?productCode=${id}&productName=${encodeURIComponent(product?.name || '')}`,
    );
  };
  const handleEditQnA = qnaCode => {
    navigate(
      `/qna/edit?qnaCode=${qnaCode}&productName=${encodeURIComponent(product?.name || '')}`,
    );
  };
  const myQnA = data.userCode === userCode;
  console.log('🚀 ~ QnATab ~ myQnA:', myQnA);

  return (
    <div>
      <h2 className='font-semibold text-xl'>QnA</h2>

      <div className='text-gray-50 text-xs pb-4'>
        구매하시려는 상품에 대해 궁금한 점이 있으신 경우 문의해주세요.
      </div>
      <button
        className='bg-black-200 text-white p-2 text-sm font-semibold rounded-md'
        onClick={handleQnACreation}
      >
        상품 QnA 작성하기
      </button>

      <section className='mt-2'>
        <table className='w-full'>
          <colgroup>
            <col className='w-1/12' />
            <col className='w-6/12' />
            <col className='w-1/12' />
            <col className='w-1/12' />
          </colgroup>
          <thead className='border-y border-gray-50 w-full'>
            <tr className='w-full'>
              <th className='px-4 py-2'>답변상태</th>
              <th className='px-4 py-2'>제목</th>
              <th className='px-4 py-2'>작성자</th>
              <th className='px-4 py-2'>작성일</th>
            </tr>
          </thead>

          <tbody className='w-full'>
            {data.map((item, index) => (
              <React.Fragment key={item.qnaCode}>
                <tr
                  className='border-b border-gray-300 w-full text-sm cursor-pointer hover:bg-primary-100/80'
                  onClick={() => handleRowClick(item.qnaCode, item)}
                >
                  <td className='px-4 py-2 text-center'>{item.answerStatus}</td>

                  <td className='px-4 py-2 text-left'>
                    {item.lockStatus === 1 ? (
                      item.userCode === userCode ? (
                        <div className='flex items-center gap-1'>
                          {item.qnaTitle}
                          <Lock size={12} />
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-gray-600'>
                          비공개 글입니다.
                          <Lock size={12} />
                        </div>
                      )
                    ) : (
                      item.qnaTitle
                    )}
                  </td>
                  <td className='px-4 py-2 text-center'>{item.qnaWriter}</td>
                  <td className='px-4 py-2 text-center'>
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
                {expandedRow === item.qnaCode && (
                  <>
                    <tr className='border-b border-gray-400 text-sm bg-primary-100/60'>
                      <td className='px-4 py-3'></td>
                      <td className='px-4 py-3 text-left whitespace-pre-wrap text-gray-700'>
                        <div className='flex flex-col gap-2'>
                          {item.qnaContents}
                          {item.userCode === userCode && (
                            <div className='flex items-center text-right gap-2'>
                              <button
                                className='text-xs border-r-2 leading-tight pr-2 border-gray-400'
                                onClick={() => handleEditQnA(item.qnaCode)}
                              >
                                수정
                              </button>
                              <button
                                className=' text-xs'
                                onClick={() => handleDelete(item.qnaCode)}
                              >
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className='px-4 py-3'></td>
                      <td className='px-4 py-3'></td>
                    </tr>
                    {item.answerContents && (
                      <tr className='border-b border-gray-200 text-sm bg-primary-100/60'>
                        <td className='px-4 py-3 text-center'>
                          <span className='bg-black-200 text-white text-xs px-2 py-1 rounded'>
                            답변
                          </span>
                        </td>
                        <td className='px-4 py-3 text-left whitespace-pre-wrap text-gray-700'>
                          {item.answerContents}
                        </td>
                        <td className='px-4 py-3 text-center text-gray-500'>
                          판매자
                        </td>
                        <td className='px-4 py-3 text-center text-gray-500'>
                          {formatDate(item.answerAt)}
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      <Pagination totalPage={pagination.totalPages} />
    </div>
  );
}
