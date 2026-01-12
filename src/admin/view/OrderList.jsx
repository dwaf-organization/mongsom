import { useEffect, useMemo, useRef, useState } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import OrderSearchSection from '../components/section/orderList/OrderSearchSection';
import OrderTableSection from '../components/section/orderList/OrderTableSection';
import { useToast } from '../context/ToastContext';
import { DownLoadExcel, getOrderList } from '../api/order';
import Pagination from '../components/ui/Pagination';
import { useSearchParams } from 'react-router-dom';
import { url } from 'zod';
import { BookX } from 'lucide-react';

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
  const [deliveryStatus, setDeliveryStatus] = useState();

  const today = useMemo(() => toISODate(new Date()), []);
  const monthAgo = useMemo(() => oneMonthAgoISO(), []);

  const page = Number(searchParams.get('page') || 1);
  const size = Number(searchParams.get('size') || 10);
  const urlQuery = {
    startDate: searchParams.get('startDate') || monthAgo,
    endDate: searchParams.get('endDate') || today,
    orderId: searchParams.get('orderId') || '',
    searchKeyword: searchParams.get('searchKeyword') || '',
    deliveryStatus: searchParams.get('deliveryStatus') || '',
  };

  const bootstrappedRef = useRef(false);
  useEffect(() => {
    if (bootstrappedRef.current) return;
    const hasStart = !!searchParams.get('startDate');
    const hasEnd = !!searchParams.get('endDate');
    if (!hasStart || !hasEnd) {
      const next = {
        page: String(page || 0),
        size: String(size || 10),
        startDate: urlQuery.startDate,
        endDate: urlQuery.endDate,
        searchKeyword: urlQuery.searchKeyword,
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
        setTotalPages(0);
        return;
      }

      const d = res.data ?? {};
      setRows(Array.isArray(d.orders) ? d.orders : []);
      setTotalPages(Number(d.pagination?.totalPage) || 0);
      // addToast('주문 목록을 불러왔습니다.', 'success');
    } catch {
      addToast('네트워크 오류로 주문 목록을 불러오지 못했습니다.', 'error');
      setRows([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [searchParams]);

  const handleSearch = async values => {
    if (values.startDate > values.endDate) {
      addToast('시작일이 종료일보다 늦습니다.', 'error');
      return;
    }
    const newParams = {
      page: '0',
      size: String(size),
      startDate: values.startDate,
      endDate: values.endDate,
      searchKeyword: values.searchKeyword?.trim() || '',
      deliveryStatus: values.deliveryStatus?.trim() || '',
    };
    setSearchParams(newParams);

    // 직접 API 호출하여 조회 결과 표시
    setLoading(true);
    try {
      const res = await getOrderList({
        page: 0,
        size,
        ...values,
        searchKeyword: values.searchKeyword?.trim() || '',
        deliveryStatus: values.deliveryStatus?.trim() || '',
      });

      if (res?.code === 1) {
        const d = res.data ?? {};
        setRows(Array.isArray(d.orders) ? d.orders : []);
        setTotalPages(Number(d.pagination?.totalPage) || 0);
        addToast('주문 목록이 조회되었습니다.', 'success');
      } else {
        addToast(res?.message || '조회에 실패했습니다.', 'error');
        setRows([]);
        setTotalPages(0);
      }
    } catch {
      addToast('네트워크 오류로 조회에 실패했습니다.', 'error');
      setRows([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeExcelSelect = e => {
    const { value } = e.target;
    setDeliveryStatus(value);
  };

  const handleExcel = async () => {
    try {
      const blob = await DownLoadExcel(deliveryStatus);

      // 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // 파일명 설정 (배송상태_날짜.xlsx)
      const date = new Date().toISOString().split('T')[0];
      link.download = `주문목록_${deliveryStatus}_${date}.xlsx`;

      // 다운로드 실행
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast('엑셀 다운로드가 완료되었습니다.', 'success');
    } catch (error) {
      console.error('엑셀 다운로드 오류:', error);
      addToast('엑셀 다운로드에 실패했습니다.', 'error');
    }
  };

  console.log(totalPages);

  return (
    <InnerPaddingSectionWrapper>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>주문조회</h2>
        <div className='flex gap-2 items-center'>
          <select
            className='border border-gray-500 px-3 py-1 rounded'
            onChange={handleChangeExcelSelect}
            value={deliveryStatus}
          >
            <option value='결제대기'>결제 대기</option>
            <option value='결제완료'>결제 완료</option>
            <option value='상품준비중'>상품준비중</option>
            <option value='배송중'>배송중</option>
            <option value='배송완료'>배송완료</option>
            <option value='예약배송'>예약배송</option>
            <option value='재고부족'>재고부족</option>
            <option value='입고지연'>입고지연</option>
          </select>
          <button
            className=' flex items-center gap-1 font-semibold bg-green-900 text-sm hover:bg-green-700 text-white px-2 py-2 rounded-xl'
            onClick={handleExcel}
          >
            <BookX size={18} /> 엑셀 다운로드
          </button>
        </div>
      </div>

      <OrderSearchSection onSearch={handleSearch} defaultValues={query} />

      <OrderTableSection rows={rows} loading={loading} onRefresh={fetchList} />

      <div className='mt-6 flex justify-center'>
        <Pagination totalPage={totalPages} />
      </div>
    </InnerPaddingSectionWrapper>
  );
}
