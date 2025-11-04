import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

import PurchaseInfo from '../components/section/ShopDetail/PurchaseInfo';
import ShopDetailTabSection from '../components/section/ShopDetail/ShopDetailTabSection';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ShopDetailInfoListSection from '../components/section/ShopDetail/ShopDetailInfoListSection';
import { getProductDetail } from '../api/products';
import { Button } from '../components/ui/button';
import { useLayoutEffect } from 'react';
import BackButton from '../components/ui/BackButton';

export default function ShopDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(null); // 지금 화면에 보이는 메인
  const [nextUrl, setNextUrl] = useState(null); // 교체 예정(겹쳐 올릴) 이미지
  const [firstReady, setFirstReady] = useState(false); // 첫 로드 완료 여부

  const decodeCacheRef = useRef(new Map());
  const decodeImage = url => {
    if (!url) return Promise.resolve();
    const cache = decodeCacheRef.current;
    if (cache.has(url)) return cache.get(url);
    const p = new Promise((resolve, reject) => {
      const im = new Image();
      im.src = url;
      if (im.decode) {
        im.decode()
          .then(resolve)
          .catch(e => {
            im.onload = () => resolve();
            im.onerror = () => reject(e || new Error('image decode error'));
          });
      } else {
        im.onload = () => resolve();
        im.onerror = () => reject(new Error('image load error'));
      }
    });
    cache.set(url, p);
    return p;
  };

  useLayoutEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      window.history.scrollRestoration = prev || 'auto';
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(id);
        if (!cancelled) {
          const data = res?.data ?? res ?? null;
          setProduct(data);
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

  const imgs = useMemo(() => {
    const raw = product?.productImgUrl ?? [];
    let arr = [];
    if (Array.isArray(raw)) {
      arr = raw.map(it => {
        if (typeof it === 'string') return it;
        if (it && typeof it === 'object')
          return it.url || it.imageUrl || it.imgUrl || it.src || '';
        return '';
      });
    } else if (typeof raw === 'string') arr = [raw];
    else if (raw && typeof raw === 'object') {
      const u = raw.url || raw.imageUrl || raw.imgUrl || raw.src || '';
      arr = u ? [u] : [];
    }
    return arr.filter(Boolean);
  }, [product]);

  // 첫 진입: 첫 이미지를 선디코드 → currentUrl 세팅
  useEffect(() => {
    let cancel = false;
    if (!imgs.length) return;
    const url = imgs[0];
    setSelectedIndex(0);
    setFirstReady(false);
    decodeImage(url)
      .then(() => {
        if (!cancel) {
          setCurrentUrl(url);
          setFirstReady(true);
        }
      })
      .catch(() => {
        if (!cancel) {
          setCurrentUrl(url);
          setFirstReady(true);
        }
      });
    return () => {
      cancel = true;
    };
  }, [imgs]);

  const onThumbHover = url => {
    decodeImage(url).catch(() => {});
  };

  const onThumbClick = async index => {
    if (index === selectedIndex) return;
    const url = imgs[index];
    if (!url) return;

    setSelectedIndex(index);
    setNextUrl(url);
    try {
      await decodeImage(url);
      setSwapAnimating(true);
    } catch {
      setSwapAnimating(true);
    }
  };

  const [swapAnimating, setSwapAnimating] = useState(false);
  const handleOverlayTransitionEnd = () => {
    if (!nextUrl) return;
    setCurrentUrl(nextUrl);
    setNextUrl(null);
    setSwapAnimating(false);
  };

  useEffect(() => {
    if (!imgs.length) return;
    [selectedIndex - 1, selectedIndex + 1]
      .filter(i => i >= 0 && i < imgs.length)
      .forEach(i => decodeImage(imgs[i]).catch(() => {}));
  }, [selectedIndex, imgs]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        로딩 중…
      </div>
    );
  }

  if (!loading && (!product || product.deleteStatus === 1)) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            상품을 찾을 수 없습니다
          </h2>
          <p className='text-gray-600 mb-4'>
            요청하신 상품이 존재하지 않습니다.
          </p>
          <Button onClick={() => navigate('/shop')}>상품목록으로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <InnerPaddingSectionWrapper className='[overFlow-anchor:none]'>
      {/* <div className='flex justify-start items-center gap-2 mb-6 md:pl-14'>
        <BackButton className='w-6 h-6' />
        <p>뒤로가기</p>
      </div> */}
      <div className='flex flex-col xl:flex-row gap-8 justify-center'>
        <div className='flex flex-col gap-4 mx-auto'>
          <div className='flex justify-start items-center gap-2 mb-6'>
            <BackButton className='w-6 h-6' text={'뒤로가기'} />
          </div>
          <div
            className={[
              'relative w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100',
              firstReady ? '' : 'animate-pulse',
            ].join(' ')}
          >
            {currentUrl && (
              <img
                src={currentUrl}
                alt={product.name}
                width={400}
                height={400}
                decoding='async'
                className='absolute inset-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] object-cover'
                draggable={false}
              />
            )}

            {nextUrl && (
              <img
                src={nextUrl}
                alt={product.name}
                width={400}
                height={400}
                decoding='async'
                className={[
                  'absolute inset-0 w-[400px] h-[400px] object-cover transition-opacity duration-200',
                  swapAnimating ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
                onTransitionEnd={handleOverlayTransitionEnd}
                draggable={false}
              />
            )}
          </div>

          <div className='flex gap-2 flex-wrap'>
            {imgs.map((img, index) => (
              <button
                key={`${img}-${index}`}
                onClick={() => onThumbClick(index)}
                onMouseEnter={() => onThumbHover(img)}
                type='button'
                aria-pressed={selectedIndex === index}
                aria-label={`${product.name} 썸네일 ${index + 1}`}
                className={[
                  'w-[50px] h-[50px] rounded-lg overflow-hidden border-2 transition-all',
                  selectedIndex === index
                    ? 'ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  width={50}
                  height={50}
                  loading='lazy'
                  decoding='async'
                  className='w-full h-full object-cover'
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        <PurchaseInfo product={product} isLoading={loading} />
      </div>

      <ShopDetailTabSection />
      <ShopDetailInfoListSection
        tab={activeTab}
        product={product}
        isLoading={loading}
      />
    </InnerPaddingSectionWrapper>
  );
}
