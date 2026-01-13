import { Link } from 'react-router-dom';

export default function OrderItemListSection({ selectedItems }) {
  const calcTotalPrice = item => {
    if (item.totalPrice !== undefined) {
      return Number(item.totalPrice);
    }
    const unitPrice = Number(
      item.unitPrice ?? item.discountPrice ?? item.price ?? 0,
    );
    return unitPrice * Number(item.quantity ?? 1);
  };

  const formatOptionText = item => {
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      return item.selectedOptions
        .map(opt => `${opt.optionTypeName}: ${opt.optionValueName}`)
        .join(', ');
    }
    return item.optName ?? '';
  };

  const getImageUrl = item => {
    if (item.mainImageUrl) return item.mainImageUrl;
    if (Array.isArray(item.productImgUrl) && item.productImgUrl.length > 0) {
      return item.productImgUrl[0];
    }
    return '';
  };

  return (
    <section className='py-4'>
      <div className='flex items-center justify-between gap-2 md:mb-4'>
        <h3 className='md:text-xl text-left font-semibold '>주문 상품</h3>
        <span className='font-semibold font-montserrat md:text-xl'>
          총 {selectedItems.length}개
        </span>
      </div>
      {selectedItems.length === 0 ? (
        <p className='text-gray-500'>선택된 상품이 없습니다.</p>
      ) : (
        <ul className='flex flex-col gap-4 border-b-2 border-gray-500 pb-10'>
          {selectedItems.map(item => {
            const basePrice = Number(item.basePrice ?? item.price ?? 0);
            const discountPrice = Number(item.discountPrice ?? basePrice);
            const unitPrice = Number(item.unitPrice ?? discountPrice);
            const optionPrice = Number(item.optionPrice ?? 0);
            const hasDiscount =
              Number(item.discountPer ?? 0) > 0 || basePrice > discountPrice;

            return (
              <li
                key={item.cartId ?? item.id}
                className='flex items-start md:gap-4 border-t border-gray-500 pt-4'
              >
                <Link to={`/shop-detail/${item.productId}`}>
                  <img
                    src={getImageUrl(item)}
                    alt={item.productName}
                    className='w-[11rem] h-[11rem] object-cover rounded-lg'
                  />
                </Link>
                <div className='flex flex-col justify-between h-[150px] px-6 font-pretendard'>
                  <div className='text-left'>
                    <h4 className='font-semibold md:text-xl truncate max-w-[10rem] md:max-w-[500px]'>
                      {item.productName}
                    </h4>
                    {formatOptionText(item) && (
                      <p className='text-gray-600 text-sm md:text-base truncate max-w-[9rem] md:max-w-[500px]'>
                        옵션 | {formatOptionText(item)}
                        {optionPrice !== 0 && (
                          <span
                            className={
                              optionPrice > 0
                                ? 'text-primary-200 ml-1'
                                : 'text-blue-500 ml-1'
                            }
                          >
                            ({optionPrice > 0 ? '+' : ''}
                            {optionPrice.toLocaleString()}원)
                          </span>
                        )}
                      </p>
                    )}
                    <span>수량: {item.quantity ?? 1}개</span>
                  </div>
                  {hasDiscount ? (
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        {item.discountPer && (
                          <p className='text-pretendart text-primary-200 font-semibold'>
                            {item.discountPer}%
                          </p>
                        )}
                        <p className='text-pretendart text-sm md:text-base text-gray-500 line-through'>
                          {basePrice.toLocaleString()}원
                        </p>
                        <p className='text-pretendart text-sm md:text-base'>
                          {discountPrice.toLocaleString()}원
                        </p>
                      </div>
                      {optionPrice !== 0 && (
                        <p className='text-pretendart text-gray-600 text-sm'>
                          옵션 적용가: {unitPrice.toLocaleString()}원
                        </p>
                      )}
                      <p className='font-semibold md:text-xl text-left'>
                        {calcTotalPrice(item).toLocaleString()}원
                      </p>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-1'>
                      {optionPrice !== 0 ? (
                        <>
                          <p className='text-pretendart text-gray-500 text-sm'>
                            {discountPrice.toLocaleString()}원
                          </p>
                          <p className='text-pretendart text-sm'>
                            옵션 적용가: {unitPrice.toLocaleString()}원
                          </p>
                        </>
                      ) : null}
                      <p className='font-semibold md:text-xl text-left'>
                        {calcTotalPrice(item).toLocaleString()}원
                      </p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
