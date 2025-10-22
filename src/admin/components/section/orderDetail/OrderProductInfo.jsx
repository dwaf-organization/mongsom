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

  const userCode = order.userCode ?? null;

  const statusLabel = v => (v === 1 || v === '1' ? '주문 취소' : '주문');

  const handleOrderCancel = (orderDetailId, orderId, userCode) => {
    if (!orderDetailId || !orderId) {
      addToast('주문 취소에 필요한 정보가 없습니다.', 'error');
      return;
    }
    openModal(
      <OrderCancelModal
        orderDetailId={orderDetailId}
        orderId={orderId}
        userCode={userCode}
      />,
    );
  };

  return (
    <section className='py-10'>
      <h2 className='text-xl font-semibold text-left'>주문 상품 정보</h2>
      <div className='mt-4 rounded-xl overflow-hidden max-w-[1000px]'>
        <table className='w-full'>
          <colgroup>
            <col style={{ width: 400 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 120 }} />
          </colgroup>
          <thead className='border-y border-gray-400'>
            <tr>
              <th className='text-left px-4 py-3'>상품정보</th>
              <th>수량</th>
              <th>가격</th>
              <th>주문상태</th>
              <th>주문 취소</th>
            </tr>
          </thead>
          <tbody>
            {order.details.map(detail => {
              const img =
                Array.isArray(detail.productImgUrls) &&
                detail.productImgUrls.length > 0
                  ? detail.productImgUrls[0]
                  : null;
              const isCanceled =
                detail.orderStatus === 1 || detail.orderStatus === '1';

              return (
                <tr
                  key={detail.orderDetailId}
                  className='text-center border-b border-gray-400'
                >
                  <td className='px-6 py-3'>
                    <div className='flex items-center gap-2'>
                      {img ? (
                        <img
                          src={img}
                          alt={detail.productName}
                          className='w-[80px] h-[80px] object-cover rounded-lg'
                        />
                      ) : (
                        <div className='w-[80px] h-[80px] bg-gray-100 rounded-lg grid place-items-center text-xs text-gray-500'>
                          이미지 없음
                        </div>
                      )}
                      <div className='flex flex-col text-left gap-2 '>
                        <p className=' max-w-[300px]'>{detail.productName}</p>
                        <p className='text-gray-500 text-sm max-w-[300px] truncate'>
                          [옵션] {detail.optName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{detail.quantity}</td>
                  <td>{Number(detail.price).toLocaleString()}원</td>
                  <td>{statusLabel(detail.orderStatus)}</td>
                  <td>
                    <Button
                      type='button'
                      variant='outline'
                      className='disabled:bg-gray-300 disabled:text-black-100 w-fit'
                      onClick={() =>
                        handleOrderCancel(
                          detail.orderDetailId,
                          order.orderId,
                          userCode,
                        )
                      }
                      disabled={isCanceled}
                    >
                      {isCanceled ? '취소됨' : '주문 취소'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
