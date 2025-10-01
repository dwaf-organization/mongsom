import { useEffect, useRef, useState } from 'react';

export default function ImageSkeleton({
  src,
  alt = '',

  containerClassName = '',
  imgClassName = '',
  skeletonClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fallback = '이미지 없음',
  ...props
}) {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
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
