import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import EditProductInfoSection from '../components/section/product/EditProductInfo';
import { getProductDetail } from '../api/product';

export default function EditProductInfo() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const response = await getProductDetail(id);
      setProduct(response);
    };
    fetchProductDetail();
  }, [id]);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>상품 수정</h2>
      <EditProductInfoSection product={product} />
    </InnerPaddingSectionWrapper>
  );
}
