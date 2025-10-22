import { Link } from 'react-router-dom';

export default function OrderItemListSection({ selectedItems }) {
  const calculateTotalPrice = item => {
    const quantity = item.quantity || item.count || 1;
    // 할인가가 있으면 할인가 사용, 없으면 원가 사용
    const itemPrice = item.discountPrice || item.price;
    return itemPrice * quantity;
  };

  const OriginalPrice = item => {
    const quantity = item.quantity || item.count || 1;
    // 항상 원가 반환
    return item.price * quantity;
  };

  return (
    <section className='py-10'>
      <div className='flex items-center gap-2 mb-4'>
        <h3 className='text-xl text-left font-semibold '>주문 상품</h3>
        <span className='font-semibold font-montserrat text-xl'>
          총 {selectedItems.length}개
        </span>
      </div>
      {selectedItems.length === 0 ? (
        <p className='text-gray-500'>선택된 상품이 없습니다.</p>
      ) : (
        <ul className='flex flex-col gap-4 border-b-2 border-gray-500 pb-10'>
          {selectedItems.map(item => (
            <li
              key={item.id}
              className='flex items-start gap-4 border-t border-gray-500 pt-4'
            >
              <Link to={`/shop-detail/${item.productId}`}>
                <img
                  src={item.productImgUrl[0]}
                  alt={item.productName}
                  className='w-[200px] h-[200px] object-cover rounded-lg'
                />
              </Link>
              <div className='flex flex-col justify-between h-[150px] px-6 font-pretendard'>
                <div className='text-left'>
                  <h4 className='font-semibold text-xl truncate max-w-[500px]'>
                    {item.productName}
                  </h4>
                  <p className='text-gray-600 truncate max-w-[500px]'>
                    옵션 | {item.optName}
                  </p>
                  <span>수량: {item.quantity || item.count || 1}개</span>
                </div>
                {item.discountPrice ? (
                  <ul className='flex flex-col gap-2'>
                    <li className='flex items-center gap-2'>
                      <p className='text-pretendart text-primary-200 font-semibold'>
                        {item.discountPer}%
                      </p>
                      <p className='text-pretendart text-gray-500 line-through'>
                        {OriginalPrice(item).toLocaleString()}원
                      </p>
                    </li>
                    <p className='font-semibold text-xl text-left'>
                      {calculateTotalPrice(item).toLocaleString()}원
                    </p>
                  </ul>
                ) : (
                  <p className='font-semibold text-xl text-left'>
                    {calculateTotalPrice(item).toLocaleString()}원
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
