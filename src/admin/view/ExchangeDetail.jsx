import React, { useEffect } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import { useParams } from 'react-router-dom';
import { getExchangeDetail } from '../api/exchange';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import { changeExchangeStatus } from '../api/exchange';
import { useNavigate } from 'react-router-dom';

export default function ExchangeDetail() {
  const params = useParams();
  const { changeId } = params;
  const [exchangeData, setExchangeData] = useState(null);
  const { addToast } = useToast();
  const [exchangeStatus, setExchangeStatus] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await getExchangeDetail(changeId);
    console.log('🚀 ~ fetchData ~ response:', response);
    if (response.code === 1) {
      setExchangeData(response.data);
      setExchangeStatus(response.data?.changeInfo?.changeStatus || '');
    } else {
      setExchangeData(null);
      addToast('교환/반품 상세 정보를 불러오는데 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [changeId]);

  console.log('🚀 ~ ExchangeDetail ~ exchangeData:', exchangeData);

  const handleStatusChange = e => {
    setExchangeStatus(e.target.value);
  };

  const handleSave = async () => {
    if (
      exchangeStatus === exchangeData?.changeInfo?.changeStatus ||
      !exchangeStatus
    ) {
      addToast('변경할 상태를 선택해주세요.', 'error');
      return;
    }
    const res = await changeExchangeStatus(changeId, exchangeStatus);
    console.log('🚀 ~ handleSave ~ res:', res);
    if (res.code === 1) {
      addToast('교환/반품 상태가 변경되었습니다.', 'success');
      fetchData();
      navigate(-1);
    } else {
      addToast(res.data || '교환/반품 상태 변경에 실패했습니다.', 'error');
    }
  };

  if (!exchangeData) {
    return (
      <InnerPaddingSectionWrapper>
        <div className='flex items-center justify-center h-64'>
          <p className='text-gray-500'>로딩 중...</p>
        </div>
      </InnerPaddingSectionWrapper>
    );
  }

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900'>
        {exchangeData?.changeInfo.changeType} 상세정보
      </h2>

      <section>
        <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-4 '>
          {exchangeData?.changeInfo.changeType} 정보
        </p>
        <div className='flex gap-10 pt-6 text-sm'>
          <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
            <li>{exchangeData.changeInfo.changeType} 요청일</li>
            <li>{exchangeData.changeInfo.changeType} 사유</li>
            <li>입금요청 계좌</li>
            <li>입금요청 은행</li>
          </ul>

          <ul className='flex flex-col gap-4 text-left px-4'>
            <li>{formatDate(exchangeData.changeInfo?.requestedAt)}</li>
            <li>{formatDateTime(exchangeData.changeInfo?.reason)}</li>
            <li>{exchangeData.changeInfo?.refundAccount || '-'}</li>
            <li>{exchangeData.changeInfo?.refundBank || '-'}</li>
          </ul>
        </div>
      </section>
      <section>
        <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
          주문 정보
        </p>
        <div className='flex gap-10 pt-6 text-sm'>
          <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
            <li>주문번호</li>
            <li>주문일</li>
            <li>주문자</li>
            <li className='h-[80px]'>상품정보</li>
            <li>상품 구매금액</li>
            <li>배송비</li>
            <li>총 결제금액</li>
            <li>결제방법</li>
            <li>결제완료 일시</li>
          </ul>
          <ul className='flex flex-col gap-4 text-left px-4'>
            <li>{exchangeData.orderInfo?.orderNum}</li>
            <li>{formatDate(exchangeData.orderInfo?.orderCreatedAt)}</li>
            <li>{exchangeData.userInfo?.userName}</li>
            <li>
              <div className='flex items-center gap-4'>
                <Link to={`/shop-detail/${exchangeData.productInfo.productId}`}>
                  <img
                    src={exchangeData.productInfo?.productImgUrls?.[0] || ''}
                    alt=''
                    className='w-[80px] h-[80px] object-cover rounded-md'
                  />
                </Link>
                <div className='flex flex-col'>
                  <p>{exchangeData.productInfo?.productName || '-'}</p>
                  <p>
                    옵션:{exchangeData.productInfo?.option1Name || '-'} /{' '}
                    {exchangeData.productInfo?.option2Name || '-'}
                  </p>
                  <p>수량 : {exchangeData.productInfo?.quantity || '-'}</p>
                </div>
              </div>
            </li>
            <li>
              {(() => {
                const price = exchangeData.productInfo?.lineTotalPrice || 0;
                const finalPrice = price <= 50000 ? price - 3000 : price;
                return `${finalPrice.toLocaleString()}원`;
              })()}
            </li>
            <li>
              {(() => {
                const price = exchangeData.productInfo?.lineTotalPrice || 0;
                const finalPrice = price <= 50000 ? 3000 : 0;
                return `${finalPrice.toLocaleString()}원`;
              })()}
            </li>
            <li>{exchangeData.paymentInfo?.finalPrice?.toLocaleString()}</li>
            <li>{exchangeData.paymentInfo.paymentMethod || '무통장 입금'}</li>
            <li>{formatDateTime(exchangeData.orderInfo?.paymentAt)}</li>
          </ul>
        </div>
      </section>

      <section>
        <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
          수령인 정보
        </p>
        <div className='flex gap-10 pt-6 text-sm'>
          <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
            <li>수령인</li>
            <li>연락처</li>
            <li>주소</li>
            <li>배송 메시지</li>
          </ul>
          <ul className='flex flex-col gap-4 text-left px-4'>
            <li>{exchangeData?.deliveryInfo.receivedUserName}</li>
            <li>{exchangeData?.deliveryInfo.receivedUserPhone}</li>
            <li>
              ({exchangeData?.deliveryInfo?.receivedUserZipCode})
              {exchangeData?.deliveryInfo?.receivedUserAddress}
              {exchangeData?.deliveryInfo?.receivedUserAddress2}
            </li>
            <li>{exchangeData?.deliveryInfo?.message || '-'}</li>
          </ul>
        </div>
      </section>

      <section>
        <p className='text-lg font-semibold text-left border-b border-gray-500 pb-4 pt-10 '>
          상태 변경
        </p>
        <div className='flex gap-10 pt-6 text-sm'>
          <ul className='flex flex-col gap-4 text-left text-gray-50 px-4'>
            <li>현재 상태</li>
          </ul>
          <ul className='flex flex-col gap-4 text-left px-4'>
            <li>
              <select
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={exchangeStatus}
                onChange={handleStatusChange}
              >
                {exchangeData.changeInfo?.changeType === '교환' ? (
                  <>
                    <option value='교환신청'>교환신청</option>
                    <option value='교환중'>교환중</option>
                    <option value='교환승인'>교환승인</option>
                    <option value='교환반려'>교환반려</option>
                    <option value='교환완료'>교환완료</option>
                  </>
                ) : (
                  <>
                    <option value='반품신청'>반품신청</option>
                    <option value='반품중'>반품중</option>
                    <option value='반품승인'>반품승인</option>
                    <option value='반품반려'>반품반려</option>
                    <option value='반품완료'>반품완료</option>
                  </>
                )}
              </select>
            </li>
          </ul>
        </div>
        <div className='mt-6 flex items-center justify-center'>
          <button
            className='bg-primary-200 p-2 rounded-md w-full'
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </section>
    </InnerPaddingSectionWrapper>
  );
}
