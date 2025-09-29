import { Button } from '../../ui/button';
import Pencil from '../../../assets/icons/Pencil';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../../api/product';
import { useToast } from '../../../context/ToastContext';
import { useModal } from '../../../context/ModalContext';
import ProductDeleteModal from './ProductDeleteModal';

export default function ProductTableSection({ rows, loading }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { openModal } = useModal();
  const safeRows = Array.isArray(rows) ? rows : [];

  const handleDelete = async id => {
    openModal(<ProductDeleteModal productId={id} />);
    // const res = await deleteProduct(id);
    // console.log('🚀 ~ handleDelete ~ res:', res);
    // if (res.code === 1) {
    //   addToast('상품이 삭제되었습니다.', 'success');
    // } else {
    //   addToast(res?.data || '상품 삭제에 실패했습니다.', 'error');
    // }
  };

  return (
    <section className='py-6'>
      <div className='rounded-lg overflow-hidden pt-6'>
        <div className='flex justify-between items-center pb-2'>
          <div className='text-sm text-gray-600'>
            {loading ? '불러오는 중...' : ``}
          </div>
        </div>

        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full table-fixed divide-y divide-gray-200'>
            <colgroup>
              <col className='w-[20%]' />
              <col className='w-[20%]' />
              <col className='w-[20%]' />
              <col className='w-[18%]' />
            </colgroup>

            <thead className='whitespace-nowrap border-t-2 border-gray-400'>
              <tr>
                <th className='px-4 py-3 text-left uppercase'>상품정보</th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  판매가
                </th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  분류
                </th>
                <th className='px-4 py-3 text-center uppercase tracking-wider'>
                  관리
                </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y'>
              {!loading && safeRows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className='text-center text-sm text-gray-500 py-10'
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              )}

              {safeRows.map(item => {
                const id = item.productId ?? item.id;
                const name = item.name ?? '이름 없음';
                const img = Array.isArray(item.imageUrls)
                  ? item.imageUrls[0]
                  : typeof item.imageUrls === 'string'
                    ? item.imageUrls
                    : Array.isArray(item.imageUrls)
                      ? item.imageUrls[0]
                      : undefined;

                const discountPrice =
                  item.discountPrice ?? item.salePrice ?? null;
                const basePrice = item.price ?? 0;

                const premiumLabel =
                  item.premium === 1
                    ? '프리미엄'
                    : item.premium === 0
                      ? '일반'
                      : '-';

                const optionNames = Array.isArray(item.options)
                  ? item.options.map(o => o.optName ?? o.name).filter(Boolean)
                  : Array.isArray(item.optNames)
                    ? item.optNames
                    : [];

                return (
                  <tr key={id}>
                    <td className='px-4 py-4 text-sm text-gray-900'>
                      <div className='flex items-center gap-3'>
                        {img ? (
                          <img
                            className='h-20 w-20 rounded-lg object-cover flex-shrink-0'
                            src={img}
                            alt={name}
                            loading='lazy'
                          />
                        ) : (
                          <div className='h-20 w-20 rounded-lg bg-gray-100 grid place-items-center text-xs text-gray-500'>
                            없음
                          </div>
                        )}

                        <div className='min-w-0'>
                          <div className='truncate font-medium'>{name}</div>
                          {optionNames.length > 0 && (
                            <div className='text-gray-500 text-xs mt-1'>
                              <p className='mb-0.5'>[옵션]</p>
                              <div className='truncate max-w-[260px]'>
                                {optionNames.join(' / ')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      <div className='flex flex-col items-center gap-1'>
                        {discountPrice && (
                          <p className='text-gray-400 text-xs line-through'>
                            {Number(basePrice).toLocaleString()} 원
                          </p>
                        )}
                        <p className='font-medium'>
                          {Number(discountPrice ?? basePrice).toLocaleString()}{' '}
                          원
                        </p>
                      </div>
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900'>
                      {premiumLabel}
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                      <div className='flex flex-col items-center gap-2'>
                        <Button
                          variant='outline'
                          className=' border-black-100 py-3 text-black-100 w-full max-w-[152px]'
                          onClick={() =>
                            navigate(`/admin/edit-product-info/${id}`)
                          }
                        >
                          <Pencil />
                          수정
                        </Button>
                        <Button
                          className='w-full py-3 max-w-[152px] bg-black-100 text-white hover:bg-black-100/90'
                          onClick={() => handleDelete(id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
