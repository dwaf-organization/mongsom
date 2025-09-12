import { shop } from '../../../data/Shop';
import { Button } from '../../ui/button';
import Pencil from '../../../assets/icons/Pencil';

export default function ProductTableSection() {
  const shippingFee = 3000;
  return (
    <section className='py-6'>
      <div className='flex justify-start items-center gap-2 mb-4 pt-16 pl-4'>
        <input
          type='checkbox'
          className='h-4 w-4 text-primary-200 px-2 focus:ring-primary-200 border-gray-300 rounded'
        />

        <p className='pr-5'>선택한 제품을 모두 삭제</p>
        <Button className='w-full py-3 max-w-[100px] bg-black-100 text-white'>
          삭제
        </Button>
      </div>
      <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr>
                <th className='px- py-4 text-center  font-medium text-gray-500 uppercase tracking-wider'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 text-primary-200 focus:ring-primary-200 border-gray-300 rounded'
                  />
                </th>

                <th className='px-4 py-3 text-left uppercase tracking-wider'>
                  상품정보
                </th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  구매금액
                </th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  배송비
                </th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  상태
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y '>
              {shop.map(shop => (
                <tr key={shop.id}>
                  <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900 text-center'>
                    <input
                      type='checkbox'
                      className='h-4 w-4 text-primary-200 focus:ring-primary-200 border-gray-300 rounded'
                    />
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex items-center space-x-3'>
                      <img
                        className='h-20 w-20 rounded-lg object-cover'
                        src={shop.image}
                        alt={shop.name}
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='break-words truncate'>{shop.name}</div>
                        {shop.option.length > 1 && (
                          <div className='text-gray-500 text-xs'>
                            <p>[옵션]</p>
                            <div className='whitespace-pre-line'>
                              {shop.option.join(',\n')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex flex-col items-center gap-2'>
                      {shop.salePrice && (
                        <p className='text-gray-500 text-xs line-through'>
                          {shop.price} 원
                        </p>
                      )}
                      {shop.salePrice ? shop.salePrice : shop.price} 원
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {shippingFee} 원
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex flex-col items-center gap-2'>
                      <Button
                        variant='outline'
                        className=' border-black-100 py-3 text-black-100 w-full max-w-[152px] '
                      >
                        <Pencil />
                        수정
                      </Button>
                      <Button className='w-full py-3 max-w-[152px] bg-black-100 text-white'>
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
