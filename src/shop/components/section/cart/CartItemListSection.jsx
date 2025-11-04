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

export default function CartItemListSection({ cart = [], updateCart }) {
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
      const res = await updateCheckStatus({
        userCode,
        productId: item.productId,
        optId: item.optId ?? null,
      });
      if (res?.code !== 1) {
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
      const res = await deleteCart(
        userCode,
        item.productId,
        item.optId ?? null,
      );
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
        userCode,
        productId: item.productId,
        optId: item.optId ?? null,
        quantity: newQty,
      });

      if (res?.code === 1) {
        lastSyncedQtyRef.current[item.cartId] = newQty;
        setEditingQty(prevState => {
          const copy = { ...prevState };
          delete copy[item.cartId];
          return copy;
        });
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
    const unit = Number(item.discountPrice ?? item.price ?? 0);
    return unit * Number(item.quantity ?? 1);
  };

  return (
    <>
      <ul className='flex flex-col items-start justify-start gap-4 w-full border-b border-gray-500 pb-10 mb-4'>
        {cart.map(item => {
          const hasDiscount = Number(item.discountPer ?? 0) > 0;
          const basePrice =
            Number(item.price ?? 0) + Number(item.salesMargin ?? 0);

          const imgSrc = Array.isArray(item.productImgUrl)
            ? item.productImgUrl[0]
            : Array.isArray(item.productImgUrls)
              ? item.productImgUrls[0]
              : '';

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

              <div className='flex flex-col items-start gap-2 px-6 w-full'>
                <div className='flex justify-between gap-2 w-full'>
                  <p className='md:text-xl font-semibold whitespace-nowrap truncate max-w-[8rem] md:max-w-[500px]'>
                    {item.productName}
                  </p>
                  <div className='flex items-center gap-2'>
                    <button
                      className='text-pretendart text-sm md:text-base text-gray-500 disabled:opacity-50'
                      onClick={() => handleDelete(item)}
                      disabled={busy}
                    >
                      삭제 |
                    </button>
                    <CheckBox
                      id={`checkbox-${item.cartId}`}
                      checked={Boolean(item.checkStatus)}
                      disabled={busy}
                      onChange={v => handleCheckboxChange(item, v)}
                    />
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <p className='text-pretendart border-r border-gray-500 pr-2 text-gray-500 leading-none'>
                    옵션
                  </p>
                  <p className='text-pretendart text-gray-600 truncate max-w-[400px]'>
                    {item.optName ?? ''}
                  </p>
                </div>

                {hasDiscount ? (
                  <div className='flex items-center gap-2'>
                    <p className='text-pretendart text-primary-200 font-semibold'>
                      {item.discountPer}%
                    </p>
                    <p className='text-pretendart text-gray-500 line-through'>
                      {Number(basePrice).toLocaleString()} 원
                    </p>
                  </div>
                ) : (
                  <p>
                    {Number(item.discountPrice ?? basePrice).toLocaleString()}원
                  </p>
                )}

                <p className='text-pretendart font-semibold text-xl'>
                  {calcTotalPrice(item).toLocaleString()}원
                </p>

                <div className='flex items-center gap-3'>
                  <input
                    type='text'
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
