import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

import { getAllProductList } from '../../../api/products';
import { routes } from '../../../constants/routes';

// shadcn/ui
import { Card, CardContent } from '../../../../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../../../components/ui/carousel';

export default function MobileTopProduct() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);

  const page = searchParams.get('page') || '1';
  const sort = 'popular';

  useEffect(() => {
    const size = 12;
    getAllProductList(sort, page, { size })
      .then(res => setItems(res?.items || []))
      .catch(() => setItems([]));
  }, [sort, page]);

  return (
    // 모바일~태블릿 전용(≥1280에서 숨김)
    <section ref={ref} className='w-full bg-primary-100 py-10 xl:hidden'>
      <motion.div
        className='container mx-auto px-3 text-center'
        initial={{ y: 60, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className='text-xl font-semibold text-black-100 font-montserrat mb-1'>
          Top Product
        </h2>
        <p className='text-gray-600 text-xs mb-4'>
          고객들이 가장 많이 찾는 제품들을 만나보세요
        </p>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
            skipSnaps: false,
            dragFree: true,
            containScroll: 'trimSnaps',
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2'>
            {items.map(prod => (
              <CarouselItem
                key={prod.id ?? prod.productId}
                // 상품 2개 완전히 보이고 3번째가 일부 보이도록 (약 40% 너비)
                className='basis-[40%] pl-2'
              >
                <Link
                  to={`${routes.shopDetail}/${prod.productId}`}
                  className='block'
                >
                  <Card className='rounded-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5'>
                    <CardContent className='p-0'>
                      <div className='relative w-full aspect-square overflow-hidden rounded-t-sm bg-gray-100'>
                        <img
                          src={prod.productImgUrls?.[0]}
                          alt={prod.name}
                          className='absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 ease-in-out hover:scale-105'
                          loading='lazy'
                          decoding='async'
                          draggable={false}
                        />
                      </div>

                      <div className='p-1.5 h-[72px] flex flex-col'>
                        <h3 className='text-xs text-black-100 text-start min-h-[1.2rem] mb-0.5 leading-tight flex-grow'>
                          {prod.name.length > 12
                            ? `${prod.name.slice(0, 12)}...`
                            : prod.name}
                        </h3>

                        <div className='mt-auto'>
                          {prod.discountPer > 0 ? (
                            <div className='space-y-1 pb-1'>
                              <span className='block text-right text-xs line-through text-gray-400'>
                                {prod.price.toLocaleString()} 원
                              </span>
                              <div className='flex items-center justify-end gap-0.5'>
                                <span className='font-bold text-primary-200 text-xs bg-primary-50 px-1 py-0.5 rounded'>
                                  {prod.discountPer}%
                                </span>
                                <span className='font-bold text-black-100 text-xs'>
                                  {prod.discountPrice.toLocaleString()} 원
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className='space-y-0.5'>
                              <div className='h-[12px]'></div>
                              <span className='block text-right font-bold text-black-100 text-xs'>
                                {prod.price.toLocaleString()} 원
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 화살표 버튼 숨김 - 스와이프 전용 */}
          {/* <CarouselPrevious className='left-1 z-10 hidden md:flex' />
          <CarouselNext className='right-1 z-10 hidden md:flex' /> */}
        </Carousel>
      </motion.div>
    </section>
  );
}
