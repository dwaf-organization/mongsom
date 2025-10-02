import Slider from 'react-slick';
import { useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllProductList } from '../../../api/products';
import { createSliderSettings } from '../../../constants/sliderSettings';
import { routes } from '../../../constants/routes';

export default function TopProductSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const [searchParams] = useSearchParams();
  const [productItems, setProductItems] = useState([]);

  const sort = searchParams.get('sort') || 'all';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const size = sort === 'popular' ? 9 : undefined;
    getAllProductList(sort, page, { size })
      .then(res => {
        const items = res?.items || [];
        setProductItems(items);
      })
      .catch(error => {
        console.error('상품 목록을 불러오는데 실패했습니다:', error);
        setProductItems([]);
      });
  }, [sort, page]);

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
          {Array.isArray(productItems) &&
            productItems.map(product => (
              <Link
                to={`${routes.shopDetail}/${product.productId}`}
                key={product.id}
              >
                <ul key={product.id} className='px-4'>
                  <div className='rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 gap-2 bg-white'>
                    <li className='relative items-center justify-center'>
                      <img
                        src={product.productImgUrls[0]}
                        alt={product.name}
                        className='w-full max-w-[220px] h-[220px] object-cover rounded-lg'
                      />
                    </li>
                    <div className='h-[85px]'>
                      <h3 className='text-sm text-black-100 text-start pt-2 px-3 truncate'>
                        {product.name}
                      </h3>
                      {product.discountPer > 0 ? (
                        <div className='w-fullflex flex-col items-start justify-end py-2'>
                          <span className='flex items-center w-full justify-end font-semibold text-sm px-3 line-through text-gray-500'>
                            {product.price.toLocaleString()} 원
                          </span>
                          <div className='flex items-start justify-end'>
                            <span className='flex font-semibold text-primary-200 text-sm'>
                              {product.discountPer} %
                            </span>
                            <span className='flex items-center font-semibold text-black-100 text-sm px-3 '>
                              {product.discountPrice.toLocaleString()} 원
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className='flex items-center justify-end w-full font-semibold text-black-100 px-3 py-2'>
                          {product.price.toLocaleString()} 원
                        </span>
                      )}
                    </div>
                  </div>
                </ul>
              </Link>
            ))}
        </Slider>
      </motion.div>
    </section>
  );
}
