import { productInfo } from '../../../data/ProductInfo';

export default function ProductInfoTab({ productId }) {
  return (
    <>
      <h3 className='text-xl font-semibold text-gray-800 mb-4'>
        {productInfo.name}
      </h3>

      <div
        className='flex flex-col items-center'
        dangerouslySetInnerHTML={{ __html: productInfo.content }}
      />
    </>
  );
}
