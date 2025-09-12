import { orderList } from '../../data/OrderList';

export default function DeliveryTrackingModal({ orderId }) {
  const order = orderList.find(order => order.id === orderId);

  // 송장번호가 있는지 확인 (실제로는 order 객체에 trackingNumber 필드가 있어야 함)
  const hasTrackingNumber =
    order?.trackingNumber && order.trackingNumber !== '';

  if (!order) {
    return (
      <div className='space-y-4 rounded-lg py-6 px-6 max-w-2xl'>
        <h2 className='text-2xl font-bold text-center mb-6'>배송 조회</h2>
        <p className='text-center text-gray-600'>
          주문 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold text-center mb-6'>배송 조회</h2>

      {/* 송장번호 정보 */}
      <div className='bg-blue-50 p-4 rounded-lg'>
        <h3 className='font-semibold text-lg mb-3'>송장번호</h3>
        {hasTrackingNumber ? (
          <div className='space-y-2'>
            <p className='font-montserrat bg-white p-3 rounded border'>
              {order.trackingNumber}
            </p>
            <p className='text-sm text-gray-600'>
              위 송장번호로 택배사에서 배송 조회가 가능합니다.
            </p>
            <div className='flex gap-2 mt-3'>
              {/* <button
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                onClick={() => {
                  // 실제로는 택배사 API 연동
                  window.open(
                    `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnb_inner_parcel`,
                    '_blank',
                  );
                }}
              >
                CJ대한통운 조회
              </button>
              <button
                className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
                onClick={() => {
                  window.open(
                    `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=AD038`,
                    '_blank',
                  );
                }}
              >
                한진택배 조회
              </button> */}
            </div>
          </div>
        ) : (
          <div className='text-center py-8'>
            <div className='text-6xl mb-4'>📦</div>
            <p className='text-lg text-gray-600 mb-2'>
              조회 가능한 배송 정보가 없습니다
            </p>
            <p className='text-sm text-gray-500'>
              아직 배송이 시작되지 않았거나 송장번호가 발급되지 않았습니다.
            </p>
          </div>
        )}
      </div>

      {/* 주문 상품 내역 */}
      <div>
        <h3 className='font-semibold mb-2'>주문 상품 내역</h3>
        <div className='space-y-3'>
          {order.products.map((product, index) => (
            <div
              key={product.id}
              className='flex items-center gap-4 p-4 border border-gray-200 rounded-lg'
            >
              <img
                src={product.image}
                alt={product.name}
                className='w-16 h-16 object-cover rounded-lg'
              />
              <div className='flex-1'>
                <h4 className=''>{product.name}</h4>
                <p className='text-gray-600 text-sm'>옵션: {product.option}</p>
                <p className='text-gray-600 text-sm'>
                  수량: {product.quantity}개
                </p>
              </div>
              <div className='text-right'>
                <p className='font-semibold '>
                  {product.totalPrice.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='font-semibold mb-2'>배송지 정보</h3>
        <div className='p-4 rounded-lg border border-gray-300'>
          <p className='font-semibold'>{order.shippingAddress.name}</p>
          <p className='text-gray-600'>{order.shippingAddress.phone}</p>
          <p className='text-gray-600'>
            {order.shippingAddress.address}{' '}
            {order.shippingAddress.detailAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
