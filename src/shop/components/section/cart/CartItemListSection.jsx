import { useState } from 'react';
import CheckBox from '../../ui/CheckBox';
import CheckItemDeleteButton from '../../ui/cart/CheckItemDeleteButton';
import ImageSkeleton from '../../ui/ImageSkeleton';
import { updateCheckStatus } from '../../../api/cart';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

export default function CartItemListSection({ cart = [], updateCart }) {
  const { userCode } = useAuth();
  const { addToast } = useToast();
  const [pendingIds, setPendingIds] = useState(new Set());

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

    const prev = cart; // 롤백용
    // 낙관적 업데이트
    updateOne(item.cartId, { checkStatus: Boolean(nextChecked) });
    setPending(item.cartId, true);

    try {
      await updateCheckStatus({
        userCode,
        productId: item.productId,
        optId: item.optId ?? null,
      });
      // 성공 시 끝
    } catch (e) {
      // 실패 → 롤백
      updateCart(prev);
      addToast('체크 상태 변경에 실패했습니다.', 'error');
    } finally {
      setPending(item.cartId, false);
    }
  };

  const handleQuantityInput = (cartId, value) => {
    const n = Number(onlyDigits(value));
    updateOne(cartId, { quantity: Math.max(1, n || 1) });
  };

  const calcTotalPrice = item => {
    const unit = Number(item.discountPrice ?? item.price ?? 0);
    return unit * Number(item.quantity ?? 1);
  };

  return (
    <>
      <ul className='flex flex-col items-start justify-start gap-4 w-full'>
        {cart.map(item => {
          const hasDiscount =
            Number(item.discountPer ?? 0) > 0 &&
            Number(item.discountPrice ?? item.price) < Number(item.price ?? 0);

          const imgSrc = Array.isArray(item.productImgUrl)
            ? item.productImgUrl[0]
            : '';
          const busy = pendingIds.has(item.cartId);

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
                  <p className='text-xl font-semibold whitespace-nowrap'>
                    {item.productName}
                  </p>

                  <CheckBox
                    id={`checkbox-${item.cartId}`}
                    checked={Boolean(item.checkStatus)}
                    disabled={busy}
                    onChange={v => handleCheckboxChange(item, v)}
                  />
                </div>

                <div className='flex items-center gap-2'>
                  <p className='text-pretendart border-r border-gray-500 pr-2 text-gray-500 leading-none'>
                    옵션
                  </p>
                  <p className='text-pretendart text-gray-600'>
                    {item.optName ?? ''}
                  </p>
                </div>

                {hasDiscount ? (
                  <div className='flex items-center gap-2'>
                    <p className='text-pretendart text-primary-200 font-semibold'>
                      {item.discountPer}%
                    </p>
                    <p className='text-pretendart text-gray-500 line-through'>
                      {Number(item.price).toLocaleString()}원
                    </p>
                  </div>
                ) : (
                  <p>{Number(item.price).toLocaleString()}원</p>
                )}

                <p className='text-pretendart font-semibold text-xl'>
                  {calcTotalPrice(item).toLocaleString()}원
                </p>

                <div className='flex items-center gap-3'>
                  <input
                    type='text'
                    value={item.quantity}
                    onChange={e =>
                      handleQuantityInput(item.cartId, e.target.value)
                    }
                    className='border border-gray-500 px-2 max-w-[70px] rounded-lg focus:outline-primary-200 text-center'
                  />

                  <span className='text-gray-500'>개</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div>
        <CheckItemDeleteButton cart={cart} updateCart={updateCart} />
      </div>
    </>
  );
}
