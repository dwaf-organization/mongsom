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
        /* 기본 레이아웃 */
        .rich-content :where(p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table) {
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }
        .rich-content :where(img, figure, video, iframe) {
          max-width: 800px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .rich-content p:has(> img),
        .rich-content p:has(> a > img) {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Quill 에디터 헤더 스타일 */
        .rich-content h1 {
          font-size: 2em;
          font-weight: bold;
        }
        .rich-content h2 {
          font-size: 1.5em;
          font-weight: bold;
        }
        .rich-content h3 {
          font-size: 1.17em;
          font-weight: bold;
        }

        /* Quill 에디터 정렬 클래스 */
        .rich-content .ql-align-center {
          text-align: center;
          max-width: none;
        }
        .rich-content .ql-align-right {
          text-align: right;
          max-width: none;
        }
        .rich-content .ql-align-justify {
          text-align: justify;
        }

        /* Quill 에디터 텍스트 스타일 */
        .rich-content strong {
          font-weight: bold;
        }
        .rich-content em {
          font-style: italic;
        }
        .rich-content u {
          text-decoration: underline;
        }
        .rich-content s {
          text-decoration: line-through;
        }
        .rich-content sub {
          vertical-align: sub;
          font-size: smaller;
        }
        .rich-content sup {
          vertical-align: super;
          font-size: smaller;
        }

        /* Quill 에디터 리스트 스타일 */
        .rich-content ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .rich-content ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }

        /* Quill 에디터 인용구 스타일 */
        .rich-content blockquote {
          border-left: 4px solid #ccc;
          padding-left: 1em;
          margin-left: 0;
          color: #666;
        }

        /* Quill 에디터 코드 블록 스타일 */
        .rich-content pre {
          background-color: #f4f4f4;
          border-radius: 4px;
          padding: 1em;
          overflow-x: auto;
          font-family: monospace;
        }

        /* Quill 에디터 링크 스타일 */
        .rich-content a {
          color: #06c;
          text-decoration: underline;
        }

        /* Quill 에디터 인라인 스타일 (color, background) */
        .rich-content [style*="color"] {
          /* 인라인 color 스타일 유지 */
        }
        .rich-content [style*="background"] {
          /* 인라인 background 스타일 유지 */
        }
      `}</style>
    </>
  );
}
