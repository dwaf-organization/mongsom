export default function ProductInfoSkeleton() {
  return (
    <div className='prose prose-neutral max-w-none mx-auto'>
      <div className='max-w-[680px] mx-auto animate-pulse space-y-4'>
        <div className='h-7 w-2/3 bg-gray-200 rounded' />
        <div className='h-4 w-full bg-gray-200 rounded' />
        <div className='h-4 w-11/12 bg-gray-200 rounded' />
        <div className='h-4 w-5/6 bg-gray-200 rounded' />
      </div>

      <div className='mt-6 max-w-[800px] mx-auto'>
        <div className='w-full aspect-[16/9] bg-gray-200 rounded-lg animate-pulse' />
      </div>

      <div className='mt-8 max-w-[680px] mx-auto animate-pulse space-y-3'>
        <div className='h-4 w-full bg-gray-200 rounded' />
        <div className='h-4 w-10/12 bg-gray-200 rounded' />
        <div className='h-4 w-9/12 bg-gray-200 rounded' />
      </div>
    </div>
  );
}
