import { fetchData } from '../instance';

export const createOrder = async order => {
  console.log('🚀 ~ createOrder ~ order:', order);
  const response = await fetchData.post('api/v1/order/create', {
    body: JSON.stringify(order),
  });
  console.log('🚀 ~ createOrder ~ response:', response);
  return response.data;
};
