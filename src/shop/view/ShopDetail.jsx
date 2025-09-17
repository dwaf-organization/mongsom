import { useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { shop } from '../data/Shop';
import PurchaseInfo from '../components/section/ShopDetail/PurchaseInfo';
import ShopDetailTabSection from '../components/section/ShopDetail/ShopDetailTabSection';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ShopDetailInfoListSection from '../components/section/ShopDetail/ShopDetailInfoListSection';

export default function ShopDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'info';
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = useMemo(() => {
    return shop.find(item => item.id === parseInt(id));
  }, [id]);

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
            <img
              src={product.image[selectedImageIndex]}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          </div>

          <div className='flex gap-2 flex-wrap'>
            {product.image.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-[50px] h-[50px] rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>
        <PurchaseInfo product={product} />
      </div>
      <ShopDetailTabSection />
      <ShopDetailInfoListSection tab={activeTab} productId={id} />
    </InnerPaddingSectionWrapper>
  );
}
