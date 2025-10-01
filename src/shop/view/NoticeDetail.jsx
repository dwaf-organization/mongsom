import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { getNoticeDetail } from '../api/notice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function NoticeDetail() {
  const { id } = useParams();

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
  return (
    <InnerPaddingSectionWrapper>
      <ul className='flex items-center justify-between gap-4 border-b border-gray-500 pb-4 pt-10 '>
        <li>
          <p className='text-2xl font-semibold text-left px-4'>
            {notice && notice.title}
          </p>
        </li>
        <li className='flex items-center justify-between gap-4 px-4'>
          <p className='text-sm text-left'>
            작성자 : {notice && notice.writer}
          </p>
          <p className='text-sm text-left '>
            작성일 : {formatDate(notice && notice.createdAt)}
          </p>
        </li>
      </ul>

      <div
        className='pt-10'
        dangerouslySetInnerHTML={{ __html: notice && notice.contents }}
      >
        {/* {notice && notice.contents} */}
      </div>
    </InnerPaddingSectionWrapper>
  );
}
