import { useEffect, useMemo, useRef, useState } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderSearchSection from '../components/section/orderList/OrderSearchSection';
import OrderTableSection from '../components/section/orderList/OrderTableSection';
import { useToast } from '../context/ToastContext';
import { getOrderList } from '../api/order';
import Pagination from '../components/ui/Pagination';
import { useSearchParams } from 'react-router-dom';

const toISODate = d =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

const oneMonthAgoISO = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const day = today.getDate();
  const lastPrev = new Date(y, m, 0).getDate();
  const targetDay = Math.min(day, lastPrev);
  return toISODate(new Date(y, m - 1, targetDay));
};

export default function OrderList() {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const today = useMemo(() => toISODate(new Date()), []);
  const monthAgo = useMemo(() => oneMonthAgoISO(), []);

  const page = Number(searchParams.get('page') || 1);
  const size = Number(searchParams.get('size') || 10);
  const urlQuery = {
    startDate: searchParams.get('startDate') || monthAgo,
    endDate: searchParams.get('endDate') || today,
    orderId: searchParams.get('orderId') || '',
    invoiceNum: searchParams.get('invoiceNum') || '',
    receivedUserPhone: searchParams.get('receivedUserPhone') || '',
    receivedUserName: searchParams.get('receivedUserName') || '',
    deliveryStatus: searchParams.get('deliveryStatus') || '',
  };

  const bootstrappedRef = useRef(false);
  useEffect(() => {
    if (bootstrappedRef.current) return;
    const hasStart = !!searchParams.get('startDate');
    const hasEnd = !!searchParams.get('endDate');
    if (!hasStart || !hasEnd) {
      const next = {
        page: String(page || 1),
        size: String(size || 10),
        startDate: urlQuery.startDate,
        endDate: urlQuery.endDate,
        orderId: urlQuery.orderId,
        invoiceNum: urlQuery.invoiceNum,
        receivedUserPhone: urlQuery.receivedUserPhone,
        receivedUserName: urlQuery.receivedUserName,
        deliveryStatus: urlQuery.deliveryStatus,
      };
      setSearchParams(next, { replace: true });
    }
    bootstrappedRef.current = true;
  }, []);

  const [query, setQuery] = useState(urlQuery);
  useEffect(() => {
    setQuery(urlQuery);
  }, [searchParams, monthAgo, today]);

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getOrderList({
        page,
        size,
        ...urlQuery, // URL(또는 기본값) 신뢰
      });

      if (res?.code !== 1) {
        addToast(res?.message || '주문 목록 조회에 실패했습니다.', 'error');
        setRows([]);
        setTotalPages(1);
        return;
      }

      const d = res.data ?? {};
      setRows(Array.isArray(d.orders) ? d.orders : []);
      setTotalPages(Number(d.pagination?.totalPage) || 1);
    } catch {
      addToast('네트워크 오류로 주문 목록을 불러오지 못했습니다.', 'error');
      setRows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [searchParams]);

  const handleSearch = values => {
    if (values.startDate > values.endDate) {
      addToast('시작일이 종료일보다 늦습니다.', 'error');
      return;
    }
    setSearchParams({
      page: '1',
      size: String(size),
      startDate: values.startDate,
      endDate: values.endDate,
      orderId: values.orderId?.trim() || '',
      invoiceNum: values.invoiceNum?.trim() || '',
      receivedUserPhone: values.receivedUserPhone?.trim() || '',
      receivedUserName: values.receivedUserName?.trim() || '',
      deliveryStatus: values.deliveryStatus?.trim() || '',
    });
  };

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>주문조회</h2>

      <OrderSearchSection onSearch={handleSearch} defaultValues={query} />

      <OrderTableSection
        rows={rows}
        loading={loading}
        page={page}
        totalPages={totalPages}
      />

      <div className='mt-6 flex justify-center'>
        <Pagination totalPage={totalPages} />
      </div>
    </InnerPaddingSectionWrapper>
  );
}
