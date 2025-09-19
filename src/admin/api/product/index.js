import { fetchData } from '../instance';

export const createProduct = async product => {
  console.log('🚀 ~ createProduct ~ product:', product);
  const response = await fetchData.post('api/v1/admin/product/regist', {
    body: JSON.stringify(product),
  });
  console.log('🚀 ~ createProduct ~ response:', response);
  return response.data;
};
