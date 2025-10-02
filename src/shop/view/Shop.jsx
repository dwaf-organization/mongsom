import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import Select from '../components/ui/Select';
import ImageSkeleton from '../components/ui/ImageSkeleton';
import { routes } from '../constants/routes';
import Pagination from '../components/ui/Pagination';
import { getAllProductList } from '../api/products';

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
    const size = sort === 'popular' ? 9 : undefined;
    getAllProductList(sort, page, { size })
      .then(res => {
        const items = res?.items || [];
        setProductItems(items);

        const paginationData = res?.pagination || {
          currentPage: 1,
          totalPage: 1,
        };
        setPagination(paginationData);
      })
      .catch(error => {
        console.error('상품 목록을 불러오는데 실패했습니다:', error);
        setProductItems([]);
        setPagination({ currentPage: 1, totalPage: 1 });
      });
  }, [sort, page]);

  const sortOptions = [
    { value: 'new', label: '최신순' },
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
      <div className='flex items-center justify-center pb-16'>
        <Link
          to={`${routes.shop}`}
          className='text-4xl font-semibold font-montserrat'
        >
          Shop
        </Link>
      </div>
      <div className='flex items-center justify-end gap-4'>
        <Select
          options={sortOptions}
          value={sort}
          onChange={handleSortChange}
          className='w-24'
          hidden={sort === 'premium'}
        />

        <div className='flex items-center justify-center'>
          <Link
            to={`${routes.shop}?sort=all`}
            className={`rounded-full border border-gray-50 px-4 py-2 text-xs text-gray-50 w-fit 
          ${sort !== 'premium' ? 'border-primary-200 font-bold text-primary-200' : ''}
          `}
          >
            일반 상품
          </Link>
        </div>
        <Link
          to={`${routes.shop}?sort=premium`}
          className={`rounded-full border border-gray-50 px-4 py-2 text-xs text-gray-50 w-fit 
          ${sort === 'premium' ? 'border-primary-200 font-semibold text-primary-200' : ''}
          `}
        >
          프리미엄 선물용
        </Link>
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
                    <ImageSkeleton
                      src={item.productImgUrls[0]}
                      alt={item.name}
                      className='w-full max-w-[320px] h-[320px] object-cover rounded-t-lg'
                      skeletonClassName='rounded-t-lg'
                      loading='eager'
                      decoding='async'
                    />
                    <div className='p-2'>
                      {!item.discountPer && (
                        <div className='flex justify-between gap-2 '>
                          <h3 className='truncate'>{item.name}</h3>
                          <p className=' font-semibold whitespace-nowrap'>
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                      )}
                      {item.discountPer > 0 && (
                        <div className='flex flex-col gap-2'>
                          <div className='flex justify-between gap-2'>
                            <h3 className='hover:text-gray-700 truncate'>
                              {item.name}
                            </h3>
                            <p className=' font-semibold line-through text-gray-500 whitespace-nowrap'>
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
