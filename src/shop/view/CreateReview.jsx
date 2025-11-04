import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ReviewProductInfo from '../components/ui/mypage/ReviewProductInfo';
import ReviewContents from '../components/ui/mypage/ReviewContents';
import PhotoReview from '../components/section/mypage/PhotoReview';
import ReviewButtons from '../components/ui/mypage/ReviewButtons';
import { useAuth } from '../context/AuthContext';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getReviewWriteList, createReview } from '../api/review';
import { useToast } from '../context/ToastContext';
import BackButton from '../components/ui/BackButton';

export default function CreateReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderDetailId = Number(id);
  const { userCode } = useAuth();
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || '1');
  const { addToast } = useToast();

  const [target, setTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [checkedAllPages, setCheckedAllPages] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImgUrls, setReviewImgUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function findTarget() {
      if (!userCode || !orderDetailId) {
        setTarget(null);
        setLoading(false);
        setCheckedAllPages(true);
        return;
      }

      try {
        setLoading(true);
        setCheckedAllPages(false);

        const pageSize = 8;
        const first = await getReviewWriteList(userCode, initialPage, pageSize);
        const firstPayload =
          first?.data && typeof first.data === 'object' ? first.data : first;

        const itemsFirst = Array.isArray(firstPayload?.items)
          ? firstPayload.items
          : [];

        const foundFirst = itemsFirst.find(
          it => Number(it.orderDetailId) === orderDetailId,
        );
        if (!cancelled && foundFirst) {
          setTarget(foundFirst);
          setLoading(false);
          setCheckedAllPages(true);
          return;
        }

        const totalPage =
          Number(firstPayload?.pagination?.totalPage) ||
          Number(firstPayload?.totalPage) ||
          1;

        for (let p = 1; p <= totalPage; p++) {
          if (cancelled) return;
          if (p === initialPage) continue;

          const res = await getReviewWriteList(userCode, p, pageSize);
          const payload =
            res?.data && typeof res.data === 'object' ? res.data : res;
          const items = Array.isArray(payload?.items) ? payload.items : [];

          const found = items.find(
            it => Number(it.orderDetailId) === orderDetailId,
          );
          if (found) {
            if (!cancelled) {
              setTarget(found);
              setLoading(false);
              setCheckedAllPages(true);
            }
            return;
          }
        }

        if (!cancelled) {
          setTarget(null);
          setLoading(false);
          setCheckedAllPages(true);
        }
      } catch (e) {
        console.error('리뷰 작성 대상 조회 실패:', e);
        if (!cancelled) {
          setTarget(null);
          setLoading(false);
          setCheckedAllPages(true);
        }
      }
    }

    findTarget();
    return () => {
      cancelled = true;
    };
  }, [userCode, orderDetailId, initialPage]);

  const handleSubmit = async () => {
    if (!orderDetailId || !userCode) return alert('잘못된 접근입니다.');
    if (!reviewRating) return alert('별점을 선택해주세요.');
    if (!reviewContent.trim()) return alert('리뷰 내용을 입력해주세요.');

    const payload = {
      orderDetailId,
      userCode,
      reviewRating,
      reviewContent,
      reviewImgUrls,
    };

    try {
      setSubmitting(true);
      const res = await createReview(payload);
      console.log('🚀 ~ handleSubmit ~ res:', res);
      if (res.code === 1) {
        addToast('리뷰가 등록되었습니다.', 'success');
        navigate('/mypage?tab=myReview&myreview=completedReview');
        return;
      }
      if (res.code === -1) {
        addToast(res.data || '리뷰 등록에 실패했습니다.', 'error');
        return;
      }
    } catch (e) {
      console.error('❌ 리뷰 등록 실패:', e);
      addToast('리뷰 등록에 실패했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => window.history.back();

  return (
    <InnerPaddingSectionWrapper>
      <div className=' gap-4 border-b border-gray-500'>
        <BackButton />
        <p className='text-2xl font-semibold text-left'>리뷰 작성</p>
      </div>

      {loading && (
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      )}

      {!loading && checkedAllPages && !target && (
        <div className='py-6 text-center text-gray-500'>
          이미 작성된 리뷰이거나 대상 주문을 찾을 수 없습니다.
        </div>
      )}

      {!loading && target && (
        <>
          <ReviewProductInfo
            filteredReviewWriteList={target}
            rating={reviewRating}
            onRatingChange={setReviewRating}
          />

          <ReviewContents value={reviewContent} onChange={setReviewContent} />

          <PhotoReview onUrlsChange={setReviewImgUrls} />

          <ReviewButtons
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </>
      )}
    </InnerPaddingSectionWrapper>
  );
}
