export default function ProductInfoTab({ product }) {
  return (
    <>
      <h3 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
        {product.name}
      </h3>

      <div
        className='flex flex-col items-center'
        dangerouslySetInnerHTML={{ __html: product.contents }}
      />
    </>
  );
}
