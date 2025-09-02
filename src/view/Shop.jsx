import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import { shop } from '../data/Shop';
import { routes } from '../constants/routes';
import Pagination from '../components/ui/Pagination';

export default function Shop() {
  const productItems = shop.filter(item => item.price);

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-montserrat'>Shop</h2>
      <div className='flex items-center justify-end gap-8'>
        <Button className='bg-primary-200 text-white rounded-full w-fit'>
          프리미엄 선물용
        </Button>
        <select className='border border-gray-300 rounded-md p-2'>
          <option>최신순</option>
          <option>인기순</option>
          <option>리뷰많은순</option>
        </select>
      </div>

      <ul className='grid grid-cols-3 gap-4 mt-10'>
        {productItems.map(item => (
          <motion.div
            key={item.id}
            whileHover={{
              y: -5,
              scale: 1.05,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className='w-full'
          >
            <Link to={`${routes.shopDetail}/${item.id}`}>
              <li>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-full object-cover'
                />
                {!item.saleRate && (
                  <div className='flex justify-between gap-2'>
                    <h3 className='text-lg'>{item.name}</h3>
                    <p className='text-lg font-semibold'>
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                )}
                {item.saleRate && (
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between gap-2'>
                      <h3 className='text-lg'>{item.name}</h3>
                      <p className='text-lg font-semibold line-through text-gray-500'>
                        {item.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className='flex justify-end gap-2'>
                      <p className='flex text-lg font-semibold text-red-500 justify-start'>
                        {item.saleRate}%
                      </p>
                      <p className='text-lg font-semibold text-gray-900'>
                        {item.salePrice.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                )}
              </li>
            </Link>
          </motion.div>
        ))}
      </ul>
      <Pagination totalPage={5} />
    </InnerPaddingSectionWrapper>
  );
}
