import NextChevron from '../../../asset/icons/NextChevron';
import mongsomBannerImg from '../../../asset/image/mongsomBannerImg.png';
import mongsomWhiteLogo from '../../../asset/logo/mongsom white logo.png';
import { useModal } from '../../../context/ModalContext';
import InquireModal from '../../ui/InquireModal';

export default function HeroSection() {
  const { openModal } = useModal();
  const handleClick = () => {
    openModal(<InquireModal />);
  };
  return (
    <section className='relative w-full max-h-[600px] overflow-hidden'>
      <img
        src={mongsomBannerImg}
        alt='heroImage'
        className='absolute inset-0 w-full h-full object-cover brightness-95'
      />

      <div className='absolute top-56 left-1/2 -translate-x-1/2 -translate-y-1/2  text-center'>
        <p className='text-white/60'>특별한 날, 행복을 전해 줄 선물</p>
        <p className='text-2xl font-bold text-white/80'>
          당신을 위한 하나뿐인 답례품
        </p>
      </div>
      <img
        src={mongsomWhiteLogo}
        alt=''
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 object-contain'
      />
      <div className='relative z-10 flex items-center justify-center min-h-screen'>
        <button
          className='flex items-center gap-2 px-8 py-3 rounded-full text-xl
                        bg-primary-100/60 text-black-100'
          onClick={handleClick}
        >
          <p className='font-semibold'>견적 · 대량구매 문의</p>
          <NextChevron />
        </button>
      </div>
    </section>
  );
}
