import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { Button } from '../components/ui/button';
import Select from '../components/ui/Select';
import { routes } from '../constants/routes';
import Pagination from '../components/ui/Pagination';
import { getAllProductList } from '../api/products';
import { useSearchParams } from 'react-router-dom';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productItems, setProductItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const sort = searchParams.get('sort') || 'all';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    console.log('API 호출 시작:', { sort, page });
    getAllProductList(sort, page)
      .then(res => {
        console.log('API 응답 data:', res);
        console.log('API 응답 items:', res?.items);

        const items = res?.items || [];
        console.log('🚀 ~ Shop ~ items:', items);
        console.log('추출된 items:', items);
        setProductItems(items);

        const paginationData = res?.pagination || {
          currentPage: 1,
          totalPage: 1,
        };
        console.log('페이지네이션 데이터:', paginationData);
        setPagination(paginationData);
      })
      .catch(error => {
        console.error('상품 목록을 불러오는데 실패했습니다:', error);
        setProductItems([]);
        setPagination({ currentPage: 1, totalPage: 1 });
      });
  }, [sort, page]);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'review', label: '리뷰많은순' },
  ];

  const handleSortChange = newSort => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('sort', newSort);
      newParams.set('page', '1');
      return newParams;
    });
  };

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-4xl font-semibold font-montserrat text-center'>
        Shop
      </h2>
      <div className='flex items-center justify-end gap-8'>
        <Button
          className='rounded-full border border-gray-50 px-4 py-2 text-xs text-gray-50 w-fit'
          variant='outline'
        >
          프리미엄 선물용
        </Button>
        <Select
          options={sortOptions}
          value={sort}
          onChange={handleSortChange}
          className='w-24'
        />
      </div>

      {(() => {
        console.log('렌더링 시 productItems:', productItems);
        console.log('productItems.length:', productItems.length);
        return productItems.length === 0 ? (
          <div className='flex justify-center items-center py-20'>
            <div className='text-lg text-gray-500'>상품을 불러오는 중...</div>
          </div>
        ) : (
          <ul className='grid grid-cols-3 gap-4 mt-10'>
            {Array.isArray(productItems) &&
              productItems.map(item => (
                <Link
                  key={item.productId}
                  to={`${routes.shopDetail}/${item.productId}`}
                >
                  <li className='roudned-lg'>
                    <div className='w-full max-w-[320px] h-[320px] rounded-t-lg relative'>
                      <div className='absolute inset-0 bg-gray-200 rounded-t-lg animate-pulse'></div>
                      <img
                        src={item.productImgUrls[0]}
                        alt={item.name}
                        className='w-full h-full object-cover rounded-t-lg relative z-10'
                        loading='eager'
                        decoding='async'
                        onLoad={e => {
                          e.target.style.opacity = '1';

                          const skeleton = e.target.previousElementSibling;
                          if (skeleton) {
                            skeleton.style.opacity = '0';
                          }
                        }}
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.3s ease-in-out',
                        }}
                      />
                    </div>
                    <div className='p-4'>
                      {!item.discountPer && (
                        <div className='flex justify-between gap-2'>
                          <h3 className=''>{item.name}</h3>
                          <p className=' font-semibold'>
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                      )}
                      {item.discountPer > 0 && (
                        <div className='flex flex-col gap-2'>
                          <div className='flex justify-between gap-2'>
                            <h3 className='hover:text-gray-700'>{item.name}</h3>
                            <p className=' font-semibold line-through text-gray-500'>
                              {item.price.toLocaleString()}원
                            </p>
                          </div>
                          <div className='flex justify-end gap-2'>
                            <p className='flex text-lg font-semibold text-red-500 justify-start'>
                              {item.discountPer}%
                            </p>
                            <p className='text-lg font-semibold text-gray-900'>
                              {item.discountPrice.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </Link>
              ))}
          </ul>
        );
      })()}
      <Pagination
        totalPage={pagination.totalPage}
        currentPage={pagination.currentPage}
      />
    </InnerPaddingSectionWrapper>
  );
}
