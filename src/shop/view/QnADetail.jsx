import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQnADetail, updateQnA, deleteQnA } from '../api/qna';
import { formatDate } from '../utils/dateUtils';
import { maskName } from '../../admin/utils/dateUtils';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import QnADeleteModal from '../components/ui/QnADeleteModal';

export default function QnADetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContents, setEditContents] = useState('');
  const navigate = useNavigate();

  const { userCode } = useAuth();
  const { addToast } = useToast();
  const { openModal } = useModal();

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

  const myQnA = data.userCode === userCode;
  console.log('🚀 ~ QnADetail ~ myQnA:', myQnA);

  const handleEdit = (qnaCode, productName) => {
    navigate(
      `/qna/edit?qnaCode=${qnaCode}&productName=${encodeURIComponent(productName || '')}`,
    );
  };

  const handleDelete = async () => {
    openModal(<QnADeleteModal qnaCode={id} />);
    // const response = await deleteQnA({
    //   qnaCode: id,
    //   userCode: userCode,
    // });
    // if (response.code == 1) {
    //   addToast('삭제되었습니다.', 'success');

    //   navigate('/qna');
    // }
  };

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='border-l-4 rounded px-2 border-black-50 font-semibold text-lg leading-tight mb-3'>
        상품 QnA
      </h2>

      {myQnA && !isEditing && (
        <div className='flex justify-end gap-2 cursor-pointer'>
          <button
            onClick={() => handleEdit(id, data.productName)}
            className='text-sm text-right text-gray-500 mb-2 border-r-2 pr-2 border-gray-400 leading-tight'
          >
            수정
          </button>
          <button
            className='text-sm text-right text-gray-500 mb-2 leading-tight'
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      )}

      <hr className=' mb-6 border-gray-500' />

      <section>
        <div className='grid grid-cols-[130px_1fr] h-full w-full'>
          <div className='bg-primary-100 text-sm font-semibold px-6 py-2 border-y border-r border-gray-400'>
            제목
          </div>
          {isEditing ? (
            <input
              type='text'
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className='px-4 py-2 border-y text-sm border-gray-400 outline-none'
            />
          ) : (
            <div
              className='px-4 py-2 border-y text-sm border-gray-400'
              data-field='contents'
            >
              {data.qnaTitle}
            </div>
          )}
          <div className='bg-primary-100 text-sm font-semibold px-6 py-2 border-b border-r border-gray-400'>
            작성자
          </div>
          <div
            className='px-4 py-2 border-b text-sm border-gray-400'
            data-field='contents'
          >
            {maskName(data.qnaWriter)}
          </div>
          <div className='bg-primary-100 text-sm font-semibold px-6 py-2 border-b border-r border-gray-400'>
            상품명
          </div>
          <div
            className='px-4 py-2 border-b text-sm border-gray-400'
            data-field='productContents'
          >
            <div className='flex justify-between items-center'>
              {data.productName}
              <Link
                to={`/shop-detail/${data.productCode}`}
                className='text-gray-50 flex items-center gap-1 text-xs'
              >
                상품 바로가기 <SquareArrowOutUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className='flex items-center border-b border-gray-400'>
          <p className='font-semibold py-3 px-6 text-sm'>작성일</p>
          <p className='py-3 text-gray-500 text-sm'>
            {formatDate(data.createdAt)}
          </p>
        </div>

        <div className='border-b pb-10 border-gray-400'>
          {isEditing ? (
            <div className='mt-6 px-6'>
              <textarea
                value={editContents}
                onChange={e => setEditContents(e.target.value)}
                className='w-full min-h-[150px] p-2 border border-gray-300 rounded outline-none resize-y'
              />
            </div>
          ) : (
            data.qnaContents && (
              <div className='mt-6 px-6'>
                <p className='whitespace-pre-wrap'>{data.qnaContents}</p>
              </div>
            )
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
