import { Button } from '../../ui/button';

export default function HeroSection() {
  return (
    <section className='w-full h-full flex flex-col items-center justify-center bg-black-100 relative min-h-screen pt-0'>
      <div className='text-center space-y-6'>
        <p className='text-primary-100 text-xl mb-8'>배너 이미지</p>
        <Button className='bg-primary-200 text-white w-fit rounded-full'>
          대량주문 견적문의
        </Button>
      </div>
    </section>
  );
}
