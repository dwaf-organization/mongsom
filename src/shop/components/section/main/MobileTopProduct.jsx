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
    // md 이상에서는 숨김: 모바일 전용
    <section ref={ref} className='w-full bg-primary-100 py-12 xl:hidden'>
      <motion.div
        className='container mx-auto px-4 text-center'
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className='text-2xl font-semibold text-black-100 font-montserrat mb-2'>
          Top Product
        </h2>
        <p className='text-gray-600 text-sm mb-6'>
          고객들이 가장 많이 찾는 제품들을 만나보세요
        </p>

        <Carousel opts={{ align: 'start', loop: true }} className='w-full'>
          <CarouselContent className='-ml-2'>
            {' '}
            // ✅ 첫 아이템 잘림 방지
            {items.map(prod => (
              <CarouselItem
                key={prod.id ?? prod.productId}
                className='basis-full sm:basis-1/2 pl-2'
              >
                <Link
                  to={`${routes.shopDetail}/${prod.productId}`}
                  className='block'
                >
                  <Card className='rounded-xl border-0 shadow-sm hover:shadow-lg transition-shadow'>
                    <CardContent className='p-0'>
                      <div className='relative w-full aspect-square overflow-hidden rounded-xl'>
                        <img
                          src={prod.productImgUrls?.[0]}
                          alt={prod.name}
                          className='absolute inset-0 w-full h-full object-cover object-center'
                        />
                      </div>

                      <div className='p-3'>
                        <h3 className='text-sm text-black-100 text-start line-clamp-2 min-h-[2.5rem] truncate'>
                          {prod.name}
                        </h3>

                        {prod.discountPer > 0 ? (
                          <div className='pt-1'>
                            <span className='block text-right text-xs line-through text-gray-500'>
                              {prod.price.toLocaleString()} 원
                            </span>
                            <div className='flex items-baseline justify-end gap-2'>
                              <span className='font-semibold text-primary-200 text-sm'>
                                {prod.discountPer}%
                              </span>
                              <span className='font-semibold text-black-100 text-sm'>
                                {prod.discountPrice.toLocaleString()} 원
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className='block text-right font-semibold text-black-100 text-sm pt-5'>
                            {prod.price.toLocaleString()} 원
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className='left-1 z-10' />
          <CarouselNext className='right-1 z-10' />
        </Carousel>
      </motion.div>
    </section>
  );
}
