import { useState, Fragment } from 'react';
import { Button } from '../../ui/button';
import { formatDate } from '../../../utils/dateUtils';
import { changeExchangeStatus } from '../../../api/exchange';
import { useToast } from '../../../context/ToastContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ExchangeTableSection({ exchangeList }) {
  const [openId, setOpenId] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = Number(searchParams.get('tab') || '교환');

  if (!exchangeList) {
    return <div>교환/반품 내역이 없습니다.</div>;
  }

  const handleExchange = async (changeId, approvalStatus) => {
    const res = await changeExchangeStatus(changeId, approvalStatus);
    console.log('🚀 ~ handleExchange ~ res:', res);

    if (res.code === 1) {
      addToast('교환/반품 상태가 변경되었습니다.', 'success');
    } else {
      addToast(res.data || '교환/반품 상태 변경에 실패했습니다.', 'error');
    }
  };

  const handleDetail = changeId => {
    navigate(`${changeId}?${searchParams.toString()}`);
  };

  return (
    <section>
      <div className='rounded-lg overflow-hidden'>
        <div className='overflow-x-auto scrollbar-hide'>
          <table className='min-w-full divide-y divide-gray-200'>
            <colgroup>
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 240 }} />
              <col style={{ width: 120 }} />
            </colgroup>
            <thead className='whitespace-nowrap'>
              <tr className='text-center'>
                <th className='px-2 py-3 font-medium uppercase tracking-wider'>
                  주문일
                </th>
                <th className='px-2 py-3 font-medium uppercase tracking-wider'>
                  주문번호
                </th>
                <th className='px-2 py-3 font-medium uppercase tracking-wider'>
                  주문자
                </th>
                <th className='px-2 py-3 font-medium text-left uppercase tracking-wider'>
                  상품정보
                </th>
                <th className='px-2 py-3 font-medium uppercase tracking-wider'>
                  구매금액
                </th>
                <th className='px-2 py-3 font-medium uppercase tracking-wider'>
                  교환사유
                </th>
                <th className='px-2 py-3 font-medium uppercase tracking-wider whitespace-nowrap'>
                  상태
                </th>
              </tr>
            </thead>

            <tbody className='divide-y'>
              {exchangeList.map(change => {
                const isOpen = openId === change.changeId;
                const productInfo = change.productInfo ?? {};
                return (
                  <Fragment key={change.changeId}>
                    <tr className='text-center'>
                      <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatDate(change.requestedAt)}
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {change.orderNum}
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {change.receivedUserName}
                      </td>
                      <td className='px-2 py-4 text-sm text-gray-900'>
                        <div className='flex items-center gap-3'>
                          <img
                            className='h-20 w-20 rounded-lg object-cover'
                            src={productInfo.productImgUrl}
                            alt={productInfo.productName}
                          />
                          <div className='min-w-0 flex-1'>
                            <div className='font-medium truncate max-w-[120px] text-left'>
                              {productInfo.productName}
                            </div>
                            {productInfo.optionComb && (
                              <div className='text-gray-500 text-xs'>
                                {productInfo.optionComb}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {change.finalPrice?.toLocaleString()}원
                      </td>

                      <td className='px-2 py-4 text-sm text-primary-700'>
                        <Button
                          type='button'
                          className='w-fit px-4'
                          onClick={() => handleDetail(change.changeId)}
                        >
                          상세보기
                        </Button>
                        {/* <button
                          type='button'
                          className='underline'
                          onClick={() =>
                            setOpenId(isOpen ? null : change.changeId)
                          }
                          aria-expanded={isOpen}
                          aria-controls={`row-detail-${change.changeId}`}
                        >
                          상세보기
                        </button> */}
                      </td>

                      <td className='px-2 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center'>
                        {change.changeStatus}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr
                        id={`row-detail-${change.changeId}`}
                        className='bchange-y bchange-gray-400'
                      >
                        <td colSpan={7} className='p-0'>
                          <div className='px-6 py-10'>
                            <div className='grid gap-4 md:grid-cols-2 '>
                              {change.contents}
                            </div>
                          </div>
                          <div className='flex gap-4 items-center justify-center py-4 bchange-t bchange-gray-400'>
                            <Button
                              variant='outline'
                              className='w-fit py-4 px-20 bchange-gray-500 text-gray-500'
                              onClick={() => handleExchange(change.changeId, 2)}
                            >
                              반려
                            </Button>
                            <Button
                              className='w-fit py-4 px-20'
                              onClick={() => handleExchange(change.changeId, 1)}
                            >
                              승인
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
