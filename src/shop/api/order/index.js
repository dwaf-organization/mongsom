export const createOrder = async order => {
  const response = await fetchData.post('api/v1/order', {
    body: JSON.stringify(order),
  });
  console.log('🚀 ~ createOrder ~ response:', response);
  return response.data;
};
