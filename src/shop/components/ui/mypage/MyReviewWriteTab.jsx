import { orderList } from '../../../data/OrderList';
import CreateReviewButton from './CreateReviewButton';

export default function MyReviewWriteTab() {
  return (
    <div>
      <p className='text-xl font-semibold text-left mt-8 px-4 pb-4 border-b border-black-100'>
        리뷰 작성
      </p>
      <ul>
        {orderList.map(item => (
          <li key={item.id}>
            <div className='flex flex-col gap-4 pt-4'>
              <div className='space-y-4'>
                {item.products.map((product, productIndex) => (
                  <div
                    key={productIndex}
                    className='flex items-start gap-4 border-b border-gray-400 pb-4'
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className='w-[80px] h-[80px] object-cover rounded-lg'
                    />

                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <p className='text-gray-900'>{product.name}</p>
                      </div>
                      <p className='text-sm text-gray-600 mb-2 text-left'>
                        옵션: {product.option}
                      </p>
                      <p className='font-montserrat text-left text-sm text-gray-500'>
                        주문 일자 : {item.orderDate}
                      </p>
                    </div>

                    <CreateReviewButton id={item.id} />
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
