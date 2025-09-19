import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import PurchaseInfo from '../components/section/ShopDetail/PurchaseInfo';
import ShopDetailTabSection from '../components/section/ShopDetail/ShopDetailTabSection';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ShopDetailInfoListSection from '../components/section/ShopDetail/ShopDetailInfoListSection';
import { getProductDetail } from '../api/products';

export default function ShopDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(id);
        if (!cancelled) {
          setProduct(res?.data ?? res ?? null);
          setSelectedImageIndex(0);
        }
      } catch (e) {
        console.error('상품 상세 로드 실패:', e);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const imgs = useMemo(() => product?.productImgUrl ?? [], [product]);
  const mainImg = imgs?.[selectedImageIndex];

  useEffect(() => {
    setImgLoaded(false);
  }, [selectedImageIndex, mainImg]);

  useEffect(() => {
    if (!Array.isArray(imgs) || imgs.length === 0) return;
    const idxs = [selectedImageIndex - 1, selectedImageIndex + 1].filter(
      i => i >= 0 && i < imgs.length,
    );
    idxs.forEach(i => {
      const im = new Image();
      im.src = imgs[i];
    });
  }, [selectedImageIndex, imgs]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        로딩 중…
      </div>
    );
  }
  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            상품을 찾을 수 없습니다
          </h1>
          <p className='text-gray-600'>요청하신 상품이 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <InnerPaddingSectionWrapper>
      <div className='flex flex-col md:flex-row gap-8 justify-center'>
        <div className='flex flex-col gap-4'>
          <div className='w-full max-w-[500px] h-[400px] rounded-lg overflow-hidden border border-gray-200'>
            {mainImg ? (
              <img
                src={mainImg}
                alt={product.name}
                width={500}
                height={400}
                decoding='async'
                fetchpriority='high'
                onLoad={() => setImgLoaded(true)}
                className={`w-[400px] h-full object-cover transition-opacity duration-200 will-change-[opacity] ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-gray-400'>
                이미지 없음
              </div>
            )}
          </div>

          <div className='flex gap-2 flex-wrap'>
            {imgs?.map((img, index) => (
              <button
                key={img + index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-[50px] h-[50px] rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  width={50}
                  height={50}
                  loading='lazy'
                  decoding='async'
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>

        <PurchaseInfo product={product} />
      </div>

      <ShopDetailTabSection />
      <ShopDetailInfoListSection tab={activeTab} product={product} />
    </InnerPaddingSectionWrapper>
  );
}
