import { fetchData } from '../../instance';

export const createProduct = async product => {
  const response = await fetchData.post('/api/v1/product/create', {
    body: JSON.stringify(product),
  });
  return response.data;
};
