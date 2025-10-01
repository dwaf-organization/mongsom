import ProductActionButtons from '../../ui/mypage/ProductActionButtons';
import { pickFirstImageUrl } from '../../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export default function OrderDetailProductInfoSection({ order }) {
  const navigate = useNavigate();
  if (!order || !Array.isArray(order.details)) {
    return (
      <p className='text-center text-gray-600'>주문 정보를 찾을 수 없습니다.</p>
    );
  }

  const orderNo = order.orderId;

  const fmtPrice = n => {
    const num = Number(n);
    if (!Number.isFinite(num)) return '-';
    return `${num.toLocaleString()}원`;
  };

  const handleProductClick = productId => {
    navigate(`/shop-detail/${productId}`);
  };

  return (
    <ul className='flex flex-col gap-4 pt-4'>
      {order.details.map(d => {
        const image = pickFirstImageUrl(d.productImgUrls);
        const name = d.productName || '-';
        const option = d.optName || '-';
        const price = d.price;
        const quantity = d.quantity ?? 1;

        const statusPerItem = Array.isArray(d.changeStatus)
          ? d.changeStatus
          : d.changeStatus != null
            ? [d.changeStatus]
            : [];
        const deliveryStatusForItem =
          order.deliveryStatus ?? order.status ?? d.deliveryStatus ?? '';

        const orderStatusForItem = Array.isArray(d.orderStatus)
          ? d.orderStatus
          : d.orderStatus != null
            ? [d.orderStatus]
            : [];

        const productForActions = {
          id: d.productId,
          orderDetailId: d.orderDetailId,
          name,
          option,
          image,
          price,
          quantity,
        };

        return (
          <li
            key={d.orderDetailId ?? `${d.productId}-${d.optId ?? '0'}`}
            className='border border-gray-400 rounded-xl px-4 py-6 flex items-start justify-between'
          >
            <div className='flex flex-col gap-4'>
              <p className='text-gray-500 text-left'>주문번호 : {orderNo}</p>

              <button
                className='flex items-start gap-4'
                onClick={() => handleProductClick(d.productId)}
              >
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className='w-[80px] h-[80px] object-cover rounded-lg'
                  />
                ) : (
                  <div className='w-[80px] h-[80px] rounded-lg bg-gray-100' />
                )}

                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='text-gray-900'>{name}</p>
                  </div>
                  <p className='text-sm text-gray-600 mb-2 text-left'>
                    옵션: {option}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <span className='font-semibold'>{fmtPrice(price)}</span>
                    <span>수량: {quantity}개</span>
                  </div>
                </div>
              </button>
            </div>

            <ProductActionButtons
              product={productForActions}
              orderId={orderNo}
              changeStatus={statusPerItem}
              orderDetailId={d.orderDetailId}
              deliveryStatus={deliveryStatusForItem}
              orderStatus={orderStatusForItem}
            />
          </li>
        );
      })}
    </ul>
  );
}
