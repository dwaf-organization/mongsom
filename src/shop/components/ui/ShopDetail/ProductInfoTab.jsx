import { useEffect, useState } from 'react';
import ProductInfoSkeleton from './ProductInfoSkeleton';

export default function ProductInfoTab({ product, isLoading }) {
  console.log('🚀 ~ ProductInfoTab ~ isLoading:', isLoading);
  const html = product?.contents ?? '';
  const shouldShowSkeleton = isLoading || !html;

  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!shouldShowSkeleton) {
      const t = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    } else {
      setReady(false);
    }
  }, [shouldShowSkeleton]);

  if (shouldShowSkeleton) {
    return (
      <>
        <ProductInfoSkeleton />
        <span className='sr-only' aria-live='polite'>
          불러오는 중입니다
        </span>
      </>
    );
  }

  return (
    <>
      <div
        className={[
          'rich-content',
          'prose prose-neutral max-w-none',
          '[&_img]:block [&_img]:h-auto [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg',
          'transition-opacity duration-300',
          ready ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
        .rich-content :where(p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table) {
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
        .rich-content :where(img, figure, video, iframe) {
          max-width: 800px;
          width: 100%;
        }
        .rich-content p:has(> img),
        .rich-content p:has(> a > img) {
          max-width: 800px;
        }
      `}</style>
    </>
  );
}
