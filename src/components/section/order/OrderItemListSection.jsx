export default function OrderItemListSection({ selectedItems }) {
  const calculateTotalPrice = item => {
    if (item.salePrice) {
      return item.salePrice * item.count;
    }
    return item.price * item.count;
  };

  const OriginalPrice = item => {
    if (item.salePrice) {
      return item.price * item.count;
    }
    return item.price * item.count;
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
              <img
                src={item.image}
                alt={item.name}
                className='w-[200px] h-[200px] object-cover rounded-lg'
              />
              <div className='flex flex-col justify-between h-[150px] px-6 font-pretendard'>
                <div className='text-left'>
                  <h4 className='font-semibold text-xl'>{item.name}</h4>
                  <p className='text-gray-600 text-lg'>옵션 | {item.option}</p>
                  <span>수량: {item.count}개</span>
                </div>
                {item.salePrice ? (
                  <ul className='flex flex-col gap-2'>
                    <li className='flex items-center gap-2'>
                      <p className='text-pretendart text-primary-200 font-semibold'>
                        {item.saleRate}%
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
