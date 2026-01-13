import { useToast } from '../../../context/ToastContext';
import { useModal } from '../../../context/ModalContext';
import OrderCancelModal from '../../ui/OrderCancelModal';
import { Button } from '../../ui/button';

export default function OrderProductInfo({ order }) {
  const { addToast } = useToast();
  const { openModal } = useModal();

  if (!order) {
    return (
      <div className='py-10 text-sm text-gray-500'>
        주문 상품 정보가 없습니다.
      </div>
    );
  }

  const { orderInfo, orderItems } = order;

  const statusLabel = status => {
    switch (status) {
      case 0:
        return '주문 대기';
      case 1:
        return '주문 취소';
      case 2:
        return '주문 완료';
      default:
        return '알 수 없음';
    }
  };

  const handleOrderCancel = (orderDetailId, orderId) => {
    if (!orderDetailId || !orderId) {
      addToast('주문 취소에 필요한 정보가 없습니다.', 'error');
      return;
    }
    openModal(
      <OrderCancelModal orderDetailId={orderDetailId} orderId={orderId} />,
    );
  };

  return (
    <section className='py-10'>
      <h2 className='text-xl font-semibold text-left'>주문 상품 정보</h2>
      <div className='mt-4 max-w-[1000px] '>
        <table className='w-full'>
          <colgroup>
            <col style={{ width: 200 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 100 }} />
            {/* <col style={{ width: 120 }} /> */}
          </colgroup>
          <thead className='border-y border-gray-400'>
            <tr>
              <th className='text-left px-8 py-3'>상품정보</th>
              <th className='text-center px-8 py-3'>옵션</th>
              <th>수량</th>
              <th>가격</th>
              <th>교환 / 환불</th>
              {/* <th>주문 취소</th> */}
            </tr>
          </thead>
          <tbody>
            {orderItems?.map(item => {
              const img = item.productImgUrl || null;
              const isCanceled = item.orderStatus === 1;
              const optionText = [item.option1Name, item.option2Name]
                .filter(Boolean)
                .join(' / ');

              return (
                <tr
                  key={item.orderDetailId}
                  className='text-center border-b border-gray-400'
                >
                  <td className='px-6 py-3'>
                    <div className='flex items-center gap-2'>
                      {img ? (
                        <img
                          src={img}
                          alt={item.productName}
                          className='w-[80px] h-[80px] object-cover rounded-lg'
                        />
                      ) : (
                        <div className='w-[80px] h-[80px] bg-gray-100 rounded-lg grid place-items-center text-xs text-gray-500'>
                          이미지 없음
                        </div>
                      )}
                      <div className='flex flex-col text-left gap-2 '>
                        <p className=' max-w-[300px]'>{item.productName}</p>

                        {item.changeStatus && (
                          <p className='text-red-500 text-sm'>
                            {item.changeStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {optionText && (
                      <p className=' text-sm max-w-[300px] truncate'>
                        {optionText}
                      </p>
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.lineTotalPrice).toLocaleString()}원</td>
                  <td>{item.changeStatus || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
