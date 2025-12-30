import { useEffect, useMemo, useState, useCallback } from 'react';
import InnerPaddingSectionWrapper from '../wrapper/InnerPaddingSectionWrapper';
import ProductSearchSection from '../components/section/productList/ProductSearchSection';
import ProductTableSection from '../components/section/productList/ProductTableSection';
import Pagination from '../components/ui/Pagination';
import { useToast } from '../context/ToastContext';
import { getProductList } from '../api/product';
import { useSearchParams } from 'react-router-dom';

export default function ProductList() {
  const { addToast } = useToast();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageStr = searchParams.get('page') || '1';
  const page = useMemo(() => {
    const n = Number(pageStr);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [pageStr]);

  const [query, setQuery] = useState({
    name: '',
    premium: 2,
  });

  const size = 5;

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(
    async (next = {}) => {
      setLoading(true);
      try {
        const params = {
          page,
          size,
          ...query,
          ...next,
        };
        const res = await getProductList(params);

        if (res?.code !== 1) {
          addToast(res?.message || '상품 목록 조회에 실패했습니다.', 'error');
          setRows([]);
          setTotalPages(1);
          return;
        }

        const d = res.data ?? {};
        const list = Array.isArray(d.products)
          ? d.products
          : Array.isArray(d.list)
            ? d.list
            : Array.isArray(d.items)
              ? d.items
              : [];
        const pg = d.pagination ?? {};
        const totalPg =
          Number(pg.totalPage) ||
          Number(d.totalPages) ||
          (pg.total && size
            ? Math.max(1, Math.ceil(Number(pg.total) / size))
            : 1);

        setRows(list);
        setTotalPages(totalPg || 1);
      } catch (e) {
        addToast('네트워크 오류로 상품 목록을 불러오지 못했습니다.', 'error');
        setRows([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [addToast, page, size, query],
  );

  useEffect(() => {
    fetchList();
  }, [page, query]);

  const handleSearch = values => {
    setQuery({
      name: values.name?.trim() || '',
      premium: Number.isFinite(values.premium) ? values.premium : 2,
      size: 5,
    });
  };

  const handleDeleted = useCallback(
    async deletedId => {
      const keyOf = p => p?.productId ?? p?.id;

      const next = rows.filter(p => keyOf(p) !== deletedId);
      const wasLastItemOnPage = rows.length === 1;

      setRows(next);

      if (wasLastItemOnPage && page > 1) {
        setSearchParams({ page: String(page - 1) }, { replace: true });
        return;
      }

      await fetchList();
    },
    [rows, page, setSearchParams, fetchList],
  );

  return (
    <InnerPaddingSectionWrapper>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>상품 목록</h2>

      <ProductSearchSection onSearch={handleSearch} defaultValues={query} />

      <ProductTableSection
        rows={rows}
        loading={loading}
        onDeleted={handleDeleted}
      />

      <div className='mt-6 flex items-center justify-center'>
        <Pagination totalPage={totalPages} />
      </div>
    </InnerPaddingSectionWrapper>
  );
}
