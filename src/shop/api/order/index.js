import { fetchData } from '../instance';

export const createOrder = async order => {
  const response = await fetchData.post('api/v1/order/create', {
    body: JSON.stringify(order),
  });
  return response.data;
};

export const getOrderList = async userCode => {
  const response = await fetchData.get(`api/v1/my/order/${userCode}`);
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
  const response = await fetchData.post(`api/v1/my/change/delete`, {
    body: JSON.stringify(data),
  });
  return response.data;
};

export const getOrderDeliveryInfo = async orderId => {
  const response = await fetchData.get(`api/v1/my/delivery/${orderId}`);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
  if (response.code === -2) {
    return null;
  }
};

export const cancelOrder = async data => {
  console.log('🚀 ~ cancelOrder ~ data:', data);
  const response = await fetchData.post(`api/v1/order/cancel`, {
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ cancelOrder ~ response:', response);
  return response.data;
};
