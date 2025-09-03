import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import Select from '../components/ui/Select';
import { shop } from '../data/Shop';
import { routes } from '../constants/routes';
import Pagination from '../components/ui/Pagination';

export default function Shop() {
  const productItems = shop.filter(item => item.price);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'review', label: '리뷰많은순' },
  ];

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-montserrat'>Shop</h2>
      <div className='flex items-center justify-end gap-8'>
        <Button
          className='rounded-full border border-gray-50 px-4 py-2 text-xs text-gray-50 w-fit'
          variant='outline'
        >
          프리미엄 선물용
        </Button>
        <Select options={sortOptions} value='latest' className='w-24' />
      </div>

      <ul className='grid grid-cols-3 gap-4 mt-10'>
        {productItems.map(item => (
          <motion.div
            key={item.id}
            whileHover={{
              y: -1,
              scale: 1.01,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            className='w-full hover:shadow-lg transition-shadow duration-300 rounded-lg'
          >
            <Link to={`${routes.shopDetail}/${item.id}`}>
              <li className='roudned-lg'>
                <img
                  src={item.image}
                  alt={item.name}
                  className='w-full object-cover rounded-t-lg'
                />
                {!item.saleRate && (
                  <div className='flex justify-between gap-2 px-4'>
                    <h3 className=''>{item.name}</h3>
                    <p className=' font-semibold'>
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                )}
                {item.saleRate && (
                  <div className='flex flex-col gap-2 px-4'>
                    <div className='flex justify-between gap-2'>
                      <h3 className=''>{item.name}</h3>
                      <p className=' font-semibold line-through text-gray-500'>
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
