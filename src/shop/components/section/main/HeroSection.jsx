import NextChevron from '../../../asset/icons/NextChevron';
import mongsomBannerImg from '../../../asset/image/mongsomBannerImg.png';
import mongsomWhiteLogo from '../../../asset/logo/mongsom white logo.png';
import { useModal } from '../../../context/ModalContext';
import InquireModal from '../../ui/InquireModal';

export default function HeroSection() {
  const { openModal } = useModal();
  const handleClick = () => openModal(<InquireModal />);

  return (
    <section
      className='relative w-full h-[380px] md:h-[600px] overflow-hidden bg-center bg-cover'
      style={{
        backgroundImage: `url(${mongsomBannerImg})`,
        filter: 'brightness(0.95)',
      }}
    >
      <div className='absolute inset-0'>
        <div className='absolute top-1/3 left-1/2 -translate-x-1/2 text-center'>
          <p className='text-white/60 text-xs md:text-sm mb-1'>
            특별한 날, 행복을 전해 줄 선물
          </p>
          <p className='text-md md:text-2xl font-bold text-white whitespace-nowrap'>
            당신을 위한 하나뿐인 답례품
          </p>
        </div>

        <img
          src={mongsomWhiteLogo}
          alt='Mongsom'
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 md:w-80 object-contain'
        />

        <button
          className='absolute bottom-1/4 md:bottom-1/3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 md:px-8 py-3 rounded-full bg-primary-100/60 text-black-100'
          onClick={handleClick}
        >
          <p className='font-semibold text-sm md:text-base whitespace-nowrap'>
            견적 · 대량구매 문의
          </p>
          <NextChevron />
        </button>
      </div>
    </section>
  );
}
