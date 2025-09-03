import Slider from 'react-slick';
import { useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, useInView } from 'framer-motion';

import { topProduct } from '../../../data/TopProduct';
import { createSliderSettings } from '../../../constants/sliderSettings';

export default function TopProductSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <section ref={ref} className='w-full bg-primary-100 py-20'>
      <motion.div
        className='container mx-auto px-4 text-center max-w-[1280px]'
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className='text-4xl font-semibold text-black-100 font-montserrat mb-4'>
          Top Product
        </h2>
        <p className='text-gray-600 text-lg mb-12'>
          고객들이 가장 많이 찾는 제품들을 만나보세요
        </p>

        <Slider {...createSliderSettings()} className='max-w-[1000px] mx-auto'>
          {topProduct.map(product => (
            <ul key={product.id}>
              <div className='rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-3'>
                <li className='relative items-center justify-center'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full h-full object-cover'
                  />
                </li>

                <h3 className='text-sm text-black-100 text-start pt-2'>
                  {product.name}
                </h3>

                <span className='flex items-center font-montserrat font-semibold text-black-100'>
                  {product.price} won
                </span>
              </div>
            </ul>
          ))}
        </Slider>
      </motion.div>
    </section>
  );
}
