import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQnADetail } from '../api/qna';
import { formatDate } from '../utils/dateUtils';
import { maskName } from '../../admin/utils/dateUtils';

export default function QnADetail() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchQnADetail = async () => {
      const response = await getQnADetail(id);
      console.log('🚀 ~ fetchQnADetail ~ response:', response);
      if (response.code == 1) {
        setData(response.data);
      }
    };
    fetchQnADetail();
  }, [id]);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='border-l-4 rounded px-2 border-black-50 font-semibold text-lg leading-tight mb-3'>
        상품 QnA
      </h2>
      <hr className=' mb-6 border-gray-500' />

      <section>
        <div className='grid grid-cols-[130px_1fr] h-full w-full'>
          <div className='bg-primary-100 text-sm font-semibold px-6 py-2 border-y border-r border-gray-400'>
            제목
          </div>
          <div
            className='px-4 py-2 border-y text-sm border-gray-400'
            data-field='contents'
          >
            {data.qnaTitle}
          </div>
          <div className='bg-primary-100 text-sm font-semibold px-6 py-2 border-b border-r border-gray-400'>
            작성자
          </div>
          <div
            className='px-4 py-2 border-b text-sm border-gray-400'
            data-field='contents'
          >
            {maskName(data.qnaWriter)}
          </div>
        </div>

        <div className='flex items-center border-b border-gray-400'>
          <p className='font-semibold py-3 px-6 text-sm'>작성일</p>
          <p className='py-3 text-gray-500 text-sm'>
            {formatDate(data.createdAt)}
          </p>
        </div>

        <div className='border-b pb-10 border-gray-400'>
          {data.qnaContents && (
            <div className='mt-6 px-6'>
              {/* <h3 className='font-semibold mb-2 text-sm'>내용</h3> */}
              <p className='whitespace-pre-wrap'>{data.qnaContents}</p>
            </div>
          )}
        </div>
      </section>

      <section>
        {data.answerContents && (
          <div>
            <div className='flex items-start mt-6 '>
              <h3 className='font-semibold mb-4 text-gray-50 whitespace-nowrap text-sm pl-6'>
                답변
              </h3>
              <div className='px-6 rounded-md'>
                <p className='whitespace-pre-wrap pb-10'>
                  {data.answerContents}
                </p>
              </div>
            </div>
            <div className='flex items-center border-y border-gray-400'>
              <p className='font-semibold py-3 text-sm px-6'>답변 작성일</p>
              <p className='py-3 text-gray-500 text-sm'>
                {formatDate(data.answerAt)}
              </p>
            </div>
          </div>
        )}
      </section>
    </InnerPaddingSectionWrapper>
  );
}
