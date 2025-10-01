import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ReviewProductInfo from '../components/ui/mypage/ReviewProductInfo';
import ReviewContents from '../components/ui/mypage/ReviewContents';
import PhotoReview from '../components/section/mypage/PhotoReview';
import ReviewButtons from '../components/ui/mypage/ReviewButtons';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { getReviewWriteList, createReview } from '../api/review';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function CreateReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderDetailId = Number(id);
  const { userCode } = useAuth();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const { addToast } = useToast();

  const [reviewWriteList, setReviewWriteList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImgUrls, setReviewImgUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userCode) {
      setReviewWriteList([]);
      setLoading(false);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getReviewWriteList(userCode, page, 8);
        const payload =
          res?.data && typeof res.data === 'object' ? res.data : res;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        if (!cancel) setReviewWriteList(items);
      } catch (e) {
        console.error('리뷰 작성 목록 조회 실패:', e);
        if (!cancel) setReviewWriteList([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [userCode, page]);

  const target = useMemo(
    () =>
      reviewWriteList.find(it => Number(it.orderDetailId) === orderDetailId),
    [reviewWriteList, orderDetailId],
  );

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
      const resp = await createReview(payload);
      console.log('✅ 리뷰 등록 성공:', resp);
      addToast('리뷰가 등록되었습니다.', 'success');
      setReviewRating(0);
      setReviewContent('');
      setReviewImgUrls([]);
      navigate('/mypage?tab=myReview&myreview=completedReview');
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
      <p className='text-2xl font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
        리뷰 작성
      </p>

      {loading ? (
        <div className='py-6 text-center text-gray-500'>불러오는 중…</div>
      ) : !target ? (
        <div className='py-6 text-center text-gray-500'>
          이미 리뷰를 작성한 상품입니다
        </div>
      ) : (
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
