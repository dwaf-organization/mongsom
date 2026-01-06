import { fetchData } from '../instance';

export const createOrder = async order => {
  const response = await fetchData.post('api/v1/order/create', {
    body: JSON.stringify(order),
  });
  console.log('🚀 ~ createOrder ~ response:', response);
  return response.data;
};

export const getOrderList = async (userCode, page = 0, size = 10) => {
  const response = await fetchData.get(
    `api/v1/my/order/${userCode}?page=${page}&size=${size}`,
  );
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
  return response.data;
};

export const getOrderDetail = async orderId => {
  const response = await fetchData.get(`api/v1/my/order/detail/${orderId}`);
  console.log('🚀 ~ getOrderDetail ~ response:', response.data);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};

export const exchangeOrder = async data => {
  console.log('🚀 ~ exchangeOrder ~ data:', data);
  const response = await fetchData.post(`api/v1/my/change/create`, {
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ exchangeOrder ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};

export const deleteChangeOrder = async data => {
  console.log('🚀 ~ deleteChangeOrder ~ data:', data);
  const response = await fetchData.delete(`api/v1/my/change/delete`, {
    body: data,
  });
  return response;
};

export const getOrderDeliveryInfo = async orderId => {
  const response = await fetchData.get(`api/v1/my/delivery/${orderId}`);
  console.log('🚀 ~ getOrderDeliveryInfo ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
  if (response.code === -2) {
    return response;
  }
};

export const cancelOrder = async ({ orderId }) => {
  console.log('🚀 ~ cancelOrder ~ orderId:', orderId);
  const url = `api/v1/order/cancel/${orderId}`;
  console.log('🚀 ~ cancelOrder ~ url:', url);

  const response = await fetchData.delete(`api/v1/order/cancel/${orderId}`);
  console.log('🚀 ~ cancelOrder ~ response:', response);
  return response;
};

export const getmileage = async userCode => {
  const response = await fetchData.get(`api/v1/order/mileage/${userCode}`);
  console.log('🚀 ~ getmileage ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};
