import * as React from 'react';

import { Card, CardContent } from '../../../../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '../../../../components/ui/carousel';
import { simpleImageBanners } from '../../../constants/bannerData';
import HeroSection from './HeroSection';
import Autoplay from 'embla-carousel-autoplay';

export function BannerSlider() {
  return (
    <section className='w-full'>
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
              <div className='w-full h-[380px] md:h-[600px] overflow-hidden'>
                <a href={banner.link}>
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className='w-full h-full object-cover cursor-pointer'
                  />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className='hidden md:flex' />
        <CarouselNext className='hidden md:flex' />
        <CarouselDots />
      </Carousel>
    </section>
  );
}
