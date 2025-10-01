import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import InquireListTable from '../components/section/inquire/InquireListTable';
import Pagination from '../components/ui/Pagination';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { getInquireList } from '../api/inquire';

export default function InquireList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ 초기값 명확히
  const [loading, setLoading] = useState(false);
  const [inquiry, setInquiry] = useState([]); // ← 오탈자 수정 + 배열 기본값
  const [totalPages, setTotalPages] = useState(1);

  const page = Number(searchParams.get('page') || 1);
  const size = Number(searchParams.get('size') || 10);

  useEffect(() => {
    let abort = false;

    const fetchList = async () => {
      setLoading(true);
      try {
        const res = await getInquireList(page, size);
        // 응답 스키마에 맞춰 꺼내기 (예시는 흔한 케이스들 커버)
        if (res?.code === 1) {
          const list = res.data.inquiries ?? [];
          const pages =
            res.result?.totalPages ??
            res.data?.totalPages ??
            Math.max(
              1,
              Math.ceil(
                (res.result?.total ?? res.data?.total ?? list.length) / size,
              ),
            );

          if (!abort) {
            setInquiry(Array.isArray(list) ? list : []);
            setTotalPages(pages);
          }
        } else {
          if (!abort) {
            setInquiry([]);
            setTotalPages(1);
            // addToast?.(res?.message || '견적문의 목록 조회 실패', 'error');
          }
        }
      } catch (e) {
        if (!abort) {
          setInquiry([]);
          setTotalPages(1);
          // addToast?.('네트워크 오류로 목록을 불러오지 못했습니다.', 'error');
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };

    fetchList();
    return () => {
      abort = true;
    };
  }, [page, size]);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='mb-6 text-2xl font-bold text-gray-900'>견적문의 목록</h2>

      {/* 로딩/빈 상태 가드 */}
      {loading ? (
        <div className='py-10 text-center text-gray-600'>불러오는 중…</div>
      ) : inquiry.length === 0 ? (
        <div className='py-10 text-center text-gray-500'>
          조회된 문의가 없습니다.
        </div>
      ) : (
        <InquireListTable data={inquiry} />
      )}

      <Pagination totalPage={totalPages} />
    </InnerPaddingSectionWrapper>
  );
}
