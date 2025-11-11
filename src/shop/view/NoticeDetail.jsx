import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { getNoticeDetail } from '../api/notice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';

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
      <div className='flex justify-start items-center gap-4 pb-4 md:hidden'>
        <BackButton text={'뒤로가기'} />
      </div>
      <ul className='gap-4'>
        <li>
          <p className='md:text-2xl w-full font-semibold text-left px-2 md:px-4 whitespace-nowrap truncate border-b border-gray-500'>
            {notice && notice.title}
          </p>
        </li>
        <li className='flex justify-end gap-2 md:gap-4 px-2 md:px-4 whitespace-nowrap'>
          <p className='text-sm white-space-nowrap '>
            작성자 : {notice && notice.writer}
          </p>
          <p className='text-sm white-space-nowrap'>
            작성일 : {formatDate(notice && notice.createdAt)}
          </p>
        </li>
      </ul>

      <div
        className='py-4 px-4 border text-sm md:text-base border-gray-500 mt-10 rounded-md'
        dangerouslySetInnerHTML={{ __html: notice && notice.contents }}
      ></div>
    </InnerPaddingSectionWrapper>
  );
}
