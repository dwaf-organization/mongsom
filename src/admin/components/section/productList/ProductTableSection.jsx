import { shop } from '../../../data/Shop';
import { Button } from '../../ui/button';
import Pencil from '../../../assets/icons/Pencil';
import { useNavigate } from 'react-router-dom';

export default function ProductTableSection() {
  const navigate = useNavigate();
  const shippingFee = 3000;

  return (
    <section className='py-6'>
      <div className='rounded-lg overflow-hidden pt-16'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col className='w-[40%]' />
              <col className='w-[20%]' />
              <col className='w-[20%]' />
              <col className='w-[20%]' />
            </colgroup>
            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr>
                <th className='px-4 py-3 text-left uppercase'>상품정보</th>
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
                  <td className='px-4 py-4 text-sm text-gray-900'>
                    <div className='flex items-center space-x-3'>
                      <img
                        className='h-20 w-20 rounded-lg object-cover'
                        src={shop.image}
                        alt={shop.name}
                      />
                      <div className='min-w-0'>
                        <div className='truncate'>{shop.name}</div>
                        {shop.option.length > 1 && (
                          <div className='text-gray-500 text-xs'>
                            <p>[옵션]</p>
                            <div className='truncate max-w-[200px]'>
                              {shop.option.join('/\n')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex flex-col items-center gap-2'>
                      {shop.salePrice && (
                        <p className='text-gray-500 text-xs text-center line-through'>
                          {shop.price} 원
                        </p>
                      )}
                      {shop.salePrice ? shop.salePrice : shop.price} 원
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900'>
                    {shippingFee} 원
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='flex flex-col items-center gap-2'>
                      <Button
                        variant='outline'
                        className=' border-black-100 py-3 text-black-100 w-full max-w-[152px] '
                        onClick={() =>
                          navigate(`/admin/edit-product-info/${shop.id}`)
                        }
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
