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
      setNotice(res);
    };
    fetchNoticeDetail();
  }, [id]);

  const formatDate = d => (d ? String(d).slice(0, 10) : '');
  return (
    <InnerPaddingSectionWrapper>
      <ul className=' gap-4  pt-10 '>
        <li>
          <p className='md:text-2xl w-full font-semibold text-left px-4 whitespace-nowrap truncate border-b border-gray-500'>
            {notice && notice.title}
          </p>
        </li>
        <li className='flex justify-end gap-4 px-4 whitespace-nowrap'>
          <p className='text-sm white-space-nowrap '>
            작성자 : {notice && notice.writer}
          </p>
          <p className='text-sm white-space-nowrap'>
            작성일 : {formatDate(notice && notice.createdAt)}
          </p>
        </li>
      </ul>

      <div
        className='py-10 px-4 border text-sm md:text-base border-gray-500 mt-10 rounded-md'
        dangerouslySetInnerHTML={{ __html: notice && notice.contents }}
      ></div>
    </InnerPaddingSectionWrapper>
  );
}
