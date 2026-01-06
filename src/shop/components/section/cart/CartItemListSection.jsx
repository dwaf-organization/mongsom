import { useRef, useState, useEffect } from 'react';
import CheckBox from '../../ui/CheckBox';
import ImageSkeleton from '../../ui/ImageSkeleton';
import {
  updateCheckStatus,
  updateQuantity,
  deleteCart,
} from '../../../api/cart';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function CartItemListSection({
  cart = [],
  updateCart,
  refreshCart,
}) {
  const { userCode } = useAuth();
  const { addToast } = useToast();

  const [pendingIds, setPendingIds] = useState(new Set());
  const [editingQty, setEditingQty] = useState({});
  const lastSyncedQtyRef = useRef({});

  useEffect(() => {
    cart.forEach(item => {
      if (lastSyncedQtyRef.current[item.cartId] === undefined) {
        lastSyncedQtyRef.current[item.cartId] = Number(item.quantity || 1);
      }
    });
  }, [cart]);

  const onlyDigits = v => String(v).replace(/\D/g, '');

  const setPending = (cartId, on) => {
    setPendingIds(prev => {
      const s = new Set(prev);
      on ? s.add(cartId) : s.delete(cartId);
      return s;
    });
  };

  const updateOne = (cartId, patch) => {
    const next = cart.map(item =>
      item.cartId === cartId ? { ...item, ...patch } : item,
    );
    updateCart(next);
  };

  const handleCheckboxChange = async (item, nextChecked) => {
    if (!userCode) return;

    const prev = cart;
    updateOne(item.cartId, { checkStatus: Number(nextChecked) });
    setPending(item.cartId, true);

    try {
      const res = await updateCheckStatus(item.cartId);
      if (res?.code === 1) {
        // 성공 시 최신 데이터 재조회
        if (refreshCart) await refreshCart();
      } else {
        updateCart(prev);
        addToast(res?.message || '체크 상태 변경에 실패했습니다.', 'error');
      }
    } catch {
      updateCart(prev);
      addToast('체크 상태 변경에 실패했습니다.', 'error');
    } finally {
      setPending(item.cartId, false);
    }
  };

  // 🔧 삭제: 낙관적 업데이트 → 실패 시 롤백
  const handleDelete = async item => {
    if (!userCode) return;
    setPending(item.cartId, true);

    const prev = cart;
    // 1) 화면에서 즉시 제거
    updateCart(prev.filter(i => i.cartId !== item.cartId));

    try {
      const res = await deleteCart(item.cartId);
      if (res?.code === 1) {
        addToast('상품이 삭제되었습니다.', 'success');
      } else {
        // 2) 실패 → 롤백
        updateCart(prev);
        addToast(res?.data || '상품 삭제에 실패했습니다.', 'error');
      }
    } catch (e) {
      // 2) 오류 → 롤백
      updateCart(prev);
      addToast('상품 삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setPending(item.cartId, false);
    }
  };

  const handleQuantityInput = (cartId, value) => {
    const digits = onlyDigits(value);
    setEditingQty(prev => ({ ...prev, [cartId]: digits })); // '' 가능
  };

  const commitQuantity = async item => {
    if (!userCode) return;

    const buf = editingQty[item.cartId];
    if (buf === undefined) return;

    const parsed = parseInt(buf, 10);
    if (!buf || Number.isNaN(parsed) || parsed < 1) {
      // 복원
      addToast('수량을 1개 이상으로 입력해주세요.', 'error');
      const prevQty =
        lastSyncedQtyRef.current[item.cartId] ?? item.quantity ?? 1;
      setEditingQty(prevState => {
        const copy = { ...prevState };
        delete copy[item.cartId];
        return copy;
      });
      updateOne(item.cartId, { quantity: prevQty });
      return;
    }

    const newQty = parsed;
    const prevQty = lastSyncedQtyRef.current[item.cartId];

    if (newQty === prevQty) {
      setEditingQty(prevState => {
        const copy = { ...prevState };
        delete copy[item.cartId];
        return copy;
      });
      return;
    }

    updateOne(item.cartId, { quantity: newQty });
    setPending(item.cartId, true);

    try {
      const res = await updateQuantity({
        cartId: item.cartId,
        quantity: newQty,
      });

      if (res?.code === 1) {
        lastSyncedQtyRef.current[item.cartId] = newQty;
        setEditingQty(prevState => {
          const copy = { ...prevState };
          delete copy[item.cartId];
          return copy;
        });
        if (refreshCart) await refreshCart();
      } else {
        updateOne(item.cartId, { quantity: prevQty });
        addToast(res?.message || '수량 변경에 실패했습니다.', 'error');
      }
    } catch {
      updateOne(item.cartId, { quantity: prevQty });
      addToast('수량 변경 중 오류가 발생했습니다.', 'error');
    } finally {
      setPending(item.cartId, false);
    }
  };

  const calcTotalPrice = item => {
    // 새 API에서는 totalPrice를 직접 제공
    if (item.totalPrice !== undefined) {
      return Number(item.totalPrice);
    }
    const unit = Number(
      item.unitPrice ?? item.discountPrice ?? item.price ?? 0,
    );
    return unit * Number(item.quantity ?? 1);
  };

  const formatOptionText = item => {
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      return item.selectedOptions
        .map(opt => `${opt.optionTypeName}: ${opt.optionValueName}`)
        .join(', ');
    }
    return item.optName ?? '';
  };

  return (
    <>
      <ul className='flex flex-col items-start justify-start gap-4 w-full border-b border-gray-500 pb-10 mb-4'>
        {cart.map(item => {
          // 새 API: basePrice와 unitPrice 비교로 할인 여부 판단
          const hasDiscount =
            Number(item.discountPer ?? 0) > 0 ||
            (item.basePrice !== undefined &&
              item.unitPrice !== undefined &&
              Number(item.basePrice) > Number(item.unitPrice));

          // 새 API는 basePrice 직접 제공, 기존 API는 price + salesMargin
          const basePrice =
            item.basePrice !== undefined
              ? Number(item.basePrice)
              : Number(item.price ?? 0) + Number(item.salesMargin ?? 0);

          // 단가: 새 API는 unitPrice, 기존 API는 discountPrice
          const unitPrice = Number(
            item.unitPrice ?? item.discountPrice ?? basePrice,
          );

          const imgSrc = item.mainImageUrl;

          const busy = pendingIds.has(item.cartId);

          const displayQty =
            editingQty[item.cartId] !== undefined
              ? editingQty[item.cartId]
              : String(item.quantity ?? 1);

          return (
            <li
              key={item.cartId}
              className='flex items-start justify-start gap-4 border-t border-gray-500 py-10 w-full'
            >
              <ImageSkeleton
                src={imgSrc}
                alt={item.productName}
                containerClassName='w-[200px] h-[150px] rounded-lg'
                imgClassName='object-cover'
                skeletonClassName='rounded-lg'
                loading='lazy'
                decoding='async'
              />

              <div className='flex flex-col items-start gap-2 md:px-6 w-full'>
                <div className='flex justify-between gap-2 w-full'>
                  <p className=' font-semibold whitespace-nowrap truncate max-w-[8rem] md:max-w-[500px]'>
                    {item.productName}
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      className='text-pretendart text-sm text-gray-500 disabled:opacity-50 whitespace-nowrap'
                      onClick={() => handleDelete(item)}
                      disabled={busy}
                    >
                      삭제 |
                    </button>
                    <CheckBox
                      id={`checkbox-${item.cartId}`}
                      checked={Boolean(item.checked ?? item.checkStatus)}
                      disabled={busy}
                      onChange={v => handleCheckboxChange(item, v)}
                    />
                  </div>
                </div>

                {formatOptionText(item) && (
                  <div className='flex items-center gap-2 text-sm'>
                    <p className='text-pretendart border-r border-gray-500 pr-2 text-gray-500 leading-none'>
                      옵션
                    </p>
                    <p className='text-pretendart text-gray-600 truncate max-w-[400px]'>
                      {formatOptionText(item)}
                      {item.optionPrice !== undefined &&
                        item.optionPrice !== 0 && (
                          <span
                            className={
                              item.optionPrice > 0
                                ? 'text-primary-200 ml-1'
                                : 'text-blue-500 ml-1'
                            }
                          >
                            ({item.optionPrice > 0 ? '+' : ''}
                            {Number(item.optionPrice).toLocaleString()}원)
                          </span>
                        )}
                    </p>
                  </div>
                )}

                {hasDiscount ? (
                  <div className='flex flex-col gap-1 text-sm'>
                    <div className='flex items-center gap-2'>
                      {item.discountPer && (
                        <p className='text-pretendart text-primary-200 font-semibold'>
                          {item.discountPer}%
                        </p>
                      )}
                      <p className='text-pretendart text-gray-500 line-through'>
                        {(basePrice + item.salesMargin).toLocaleString()}원
                      </p>
                      <p className='text-pretendart'>
                        {Number(
                          item.discountPrice ?? basePrice,
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                    {item.optionPrice !== undefined &&
                      item.optionPrice !== 0 && (
                        <p className='text-pretendart text-gray-600'>
                          옵션 적용가: {unitPrice.toLocaleString()}원
                        </p>
                      )}
                  </div>
                ) : (
                  <div className='flex flex-col gap-1 text-sm'>
                    {item.optionPrice !== undefined &&
                    item.optionPrice !== 0 ? (
                      <>
                        <p className='text-pretendart text-gray-500'>
                          {Number(
                            item.discountPrice ?? basePrice,
                          ).toLocaleString()}
                          원
                        </p>
                        <p className='text-pretendart'>
                          옵션 적용가: {unitPrice.toLocaleString()}원
                        </p>
                      </>
                    ) : (
                      <p>{unitPrice.toLocaleString()}원</p>
                    )}
                  </div>
                )}

                <p className='text-pretendart font-semibold'>
                  {calcTotalPrice(item).toLocaleString()}원
                </p>

                <div className='flex items-center gap-3'>
                  <input
                    type='number'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={displayQty}
                    disabled={busy}
                    onChange={e =>
                      handleQuantityInput(item.cartId, e.target.value)
                    }
                    onBlur={() => commitQuantity(item)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') e.currentTarget.blur();
                      if (e.key === 'Escape') {
                        setEditingQty(prev => {
                          const copy = { ...prev };
                          delete copy[item.cartId];
                          return copy;
                        });
                      }
                    }}
                    className='border border-gray-500 px-2 max-w-[70px] rounded-lg focus:outline-primary-200 text-center'
                  />
                  <span className='text-gray-500'>개</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
