import * as React from 'react';

// import { Card, CardContent } from '../../../../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '../../../../components/ui/carousel';
import { simpleImageBanners } from '../../../constants/bannerData';
import HeroSection from './HeroSection';
import Autoplay from 'embla-carousel-autoplay';
import NextChevron from '../../../asset/icons/NextChevron';
import { useModal } from '../../../context/ModalContext';
import InquireModal from '../../ui/InquireModal';

export function BannerSlider() {
  const { openModal } = useModal();
  const handleClick = () => openModal(<InquireModal />);
  return (
    <section className='w-full overflow-hidden'>
      {/* 여기서 굳이 h-[400px] 이런 거 안 줌 */}
      <Carousel
        opts={{ align: 'start', loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          <CarouselItem>
            <HeroSection />
          </CarouselItem>

          {simpleImageBanners.map(banner => (
            <CarouselItem key={banner.id}>
              <div className='relative w-full h-[380px] md:h-[600px] overflow-hidden'>
                <a href={banner.link}>
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className='w-full h-full object-cover cursor-pointer'
                  />
                </a>
                <button
                  className='absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 md:px-8 py-3 rounded-full bg-primary-100/60 text-black-100'
                  onClick={handleClick}
                >
                  <p className='font-semibold text-sm md:text-base whitespace-nowrap'>
                    견적 · 대량구매 문의
                  </p>
                  <NextChevron />
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <CarouselPrevious className='hidden md:flex' /> */}
        {/* <CarouselNext className='hidden md:flex' /> */}
        <CarouselDots />
      </Carousel>
    </section>
  );
}
