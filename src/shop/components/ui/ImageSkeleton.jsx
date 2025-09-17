import { useEffect, useRef, useState } from 'react';

export default function ImageSkeleton({
  src,
  alt = '',
  // 래퍼와 이미지 클래스 분리!
  containerClassName = '',
  imgClassName = '',
  skeletonClassName = '',
  loading = 'lazy', // 기본 lazy 권장
  decoding = 'async',
  fallback = '이미지 없음',
  ...props
}) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // src 바뀌면 로딩 상태 리셋
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // 캐시된 이미지(이미 complete) 처리
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* 스켈레톤 오버레이 */}
      {!loaded && !error && (
        <div
          className={`absolute inset-0 animate-pulse bg-gray-200 ${skeletonClassName}`}
        />
      )}

      {error ? (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 ${skeletonClassName}`}
        >
          {fallback}
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src || ''}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgClassName} ${loaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
    </div>
  );
}
