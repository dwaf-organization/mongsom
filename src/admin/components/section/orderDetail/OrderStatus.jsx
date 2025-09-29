// src/admin/components/section/orderDetail/OrderStatus.jsx
import { useEffect, useMemo, useState } from 'react';
import { updateOrderStatus } from '../../../api/order';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['상품준비중', '배송준비중', '배송완료'];

function normalizeStatus(v) {
  const x = String(v ?? '')
    .trim()
    .toLowerCase();
  const map = new Map([
    ['cancel', '주문 취소'],
    ['canceled', '주문 취소'],
    ['cancelled', '주문 취소'],
    ['주문취소', '주문 취소'],
    ['주문 취소', '주문 취소'],
    ['0', '주문 취소'],

    ['item_preparing', '상품준비중'],
    ['상품 준비중', '상품준비중'],
    ['상품준비중', '상품준비중'],
    ['1', '상품준비중'],

    ['ready', '배송준비중'],
    ['preparing', '배송준비중'],
    ['배송 준비중', '배송준비중'],
    ['배송준비중', '배송준비중'],
    ['2', '배송준비중'],

    ['delivered', '배송완료'],
    ['completed', '배송완료'],
    ['배송 완료', '배송완료'],
    ['배송완료', '배송완료'],
    ['3', '배송완료'],
  ]);
  return map.get(x) || '배송준비중';
}

export default function OrderStatus({ order, saving = false }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const initial = useMemo(() => {
    const o = order ?? {};
    return {
      status: normalizeStatus(o.deliveryStatus),
      courier: o.deliveryCom ?? '',
      invoice: o.invoiceNum ?? '',
    };
  }, [order]);

  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  // ✅ 주문 취소 여부를 정규화된 값으로 판단
  const isCancelled = useMemo(
    () => normalizeStatus(order?.deliveryStatus) === '주문 취소',
    [order],
  );

  useEffect(() => setForm(initial), [initial]);

  useEffect(() => {
    if (form.status === '주문 취소' && (form.courier || form.invoice)) {
      setForm(prev => ({ ...prev, courier: '', invoice: '' }));
    }
  }, [form.status]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (submitting || saving) return;

    if (
      form.status === '배송완료' &&
      (!form.courier.trim() || !form.invoice.trim())
    ) {
      alert('배송완료로 변경하려면 택배사와 운송장 번호를 입력하세요.');
      return;
    }
    if (!order?.orderId) {
      alert('주문 정보가 없습니다.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        orderId: order.orderId,
        userCode: order.userCode,
        deliveryStatus: form.status,
        deliveryCom: form.courier.trim() || null,
        invoiceNum: form.invoice.trim() || null,
      };
      const res = await updateOrderStatus(payload);
      if (res?.code === 1) {
        addToast('주문 상태가 업데이트되었습니다.', 'success');
        navigate(`/admin/orders`);
      } else {
        throw new Error(res?.message || '업데이트 실패');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || '업데이트 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!order)
    return <div className='py-10 text-gray-500'>정보 불러오는 중 ...</div>;

  return (
    <section className='pt-10'>
      <h2 className='text-xl font-semibold text-left'>주문 상태 관리</h2>

      <form
        onSubmit={onSubmit}
        className='mt-4 rounded-xl border border-gray-400 overflow-hidden max-w-[1000px]'
      >
        <div className='grid grid-cols-[180px_1fr] text-sm'>
          {/* 주문 상태 */}
          <div className='contents'>
            <div className='bg-gray-100 text-gray-900 px-5 py-5 border-r border-gray-400'>
              주문 상태
            </div>
            <div className='px-6 py-5 border-l border-gray-300'>
              {!isCancelled ? (
                <div className='flex flex-wrap items-center gap-8'>
                  {STATUS_OPTIONS.map(opt => (
                    <label
                      key={opt}
                      className='inline-flex items-center gap-2 select-none'
                    >
                      <input
                        type='radio'
                        name='status'
                        value={opt}
                        checked={form.status === opt}
                        onChange={onChange}
                        className='peer sr-only'
                      />
                      <span
                        className={`relative h-5 w-5 rounded-full border transition
                          ${form.status === opt ? 'border-primary-200' : 'border-gray-400'}
                          peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200`}
                      >
                        <span
                          className={`absolute inset-1 rounded-full transition-transform
                            ${form.status === opt ? 'scale-100 bg-primary-200' : 'scale-0 bg-transparent'}`}
                        />
                      </span>
                      <span
                        className={
                          form.status === opt
                            ? 'text-primary-200 font-semibold'
                            : ''
                        }
                      >
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className='text-gray-500'>주문이 취소 되었습니다.</div>
              )}
            </div>
          </div>

          <div className='col-span-2 border-t border-gray-400' />

          {/* 배송 등록 */}
          <div className='contents'>
            <div className='bg-gray-100 text-gray-900 px-5 py-5 border-r border-gray-400'>
              배송 등록
            </div>
            {!isCancelled ? (
              <div className='px-6 py-5'>
                <div className='flex flex-wrap items-center gap-4'>
                  <label className='shrink-0 text-gray-900'>택배회사:</label>
                  <input
                    type='text'
                    name='courier'
                    placeholder='택배사 입력'
                    className='h-10 w-[260px] rounded-xl border border-gray-400 px-4 focus:outline-none focus:ring focus:ring-gray-200'
                    value={form.courier}
                    onChange={onChange}
                    disabled={form.status === '주문 취소'}
                  />

                  <label className='shrink-0 text-gray-900 ml-2'>
                    운송장 번호:
                  </label>
                  <input
                    type='text'
                    name='invoice'
                    placeholder='운송장 번호 입력'
                    className='h-10 w-[260px] rounded-xl border border-gray-400 px-4 focus:outline-none focus:ring focus:ring-gray-200'
                    value={form.invoice}
                    onChange={onChange}
                    disabled={form.status === '주문 취소'}
                  />
                </div>

                <div className='mt-8 w-full flex justify-center items-center'>
                  <button
                    type='submit'
                    disabled={saving || submitting}
                    className='px-6 py-3 rounded-xl bg-primary-200 text-white text-sm font-semibold disabled:opacity-60'
                    title='수정'
                  >
                    {saving || submitting ? '수정 중...' : '수정'}
                  </button>
                </div>
              </div>
            ) : (
              <div className='px-6 py-5'>
                <div className='text-gray-500'>주문이 취소 되었습니다.</div>
              </div>
            )}
          </div>
        </div>
      </form>

      <p className='mt-2 text-xs text-gray-500'>
        배송완료로 변경할 때는 택배사와 운송장 번호를 함께 저장하세요.
      </p>
    </section>
  );
}
