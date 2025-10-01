import { fetchData } from '../instance';

export const getInquireList = async ({ page = 1, size = 5 }) => {
  const url = `api/v1/admin/inquiry/list/${page}/${size}`;
  console.log('GET:', url);
  const res = await fetchData.get(url);
  console.log('🚀 ~ getProductList ~ res:', res);
  return res;
};
