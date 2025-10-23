import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { getNoticeDetail } from '../api/notice';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useModal } from '../context/ModalContext';
import NoticeDeleteModal from '../components/ui/NoticeDeleteModal';

export default function NoticeDetail() {
  const { id } = useParams();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      const res = await getNoticeDetail(id);
      console.log('🚀 ~ fetchNoticeDetail ~ res:', res);
      setNotice(res);
    };
    fetchNoticeDetail();
  }, [id]);

  const formatDate = d => (d ? String(d).slice(0, 10) : '');

  const handleDelete = () => {
    openModal(<NoticeDeleteModal noticeId={id} />);
  };

  const handleEdit = id => {
    navigate(`/admin/notice-edit/${id}`);
  };

  return (
    <InnerPaddingSectionWrapper>
      <ul className='flex items-center justify-between gap-4 border-b border-gray-500 pt-10 '>
        <li>
          <p className='text-2xl font-semibold text-left px-4 whitespace-nowrap truncate max-w-[600px]'>
            {notice && notice.title}
          </p>
        </li>
        <li className='flex items-end justify-between gap-4 px-4 whitespace-nowrap'>
          <p className='text-sm white-space-nowrap '>
            작성자 : {notice && notice.writer}
          </p>
          <p className='text-sm white-space-nowrap'>
            작성일 : {formatDate(notice && notice.createdAt)}
          </p>
        </li>
      </ul>

      <div
        className='py-10 px-4 border border-gray-500 mt-10 rounded-md'
        dangerouslySetInnerHTML={{ __html: notice && notice.contents }}
      ></div>
      <div className='flex items-center justify-end gap-2 pt-2'>
        <Button className='w-fit px-4' onClick={() => handleEdit(id)}>
          수정
        </Button>
        <Button variant='outline' className='w-fit px-4' onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </InnerPaddingSectionWrapper>
  );
}
