import { fetchData } from '../instance';

export const addCart = async cart => {
  console.log('🚀 ~ addCart ~ cart:', cart);
  const response = await fetchData.post('api/v1/cart/add', {
    body: JSON.stringify(cart),
  });
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};

export const getCart = async userCode => {
  const res = await fetchData.get(`api/v1/cart/${userCode}`);
  console.log('🚀 ~ getCart ~ res:', res);
  if (res?.code !== 1) return [];
  return res?.data || [];
};

export const updateCheckStatus = async cartId => {
  const res = await fetchData.put(`api/v1/cart/change/check`, {
    body: { cartId: cartId },
  });
  console.log('🚀 ~ updateCheckStatus ~ res:', res);
  if (res.code === 1) return res;
  if (res?.code === -1) return;
};

export const updateAllCheckStatus = async (userCode, allCheckStatus) => {
  const res = await fetchData.put(`api/v1/cart/change/check/all`, {
    body: { userCode: userCode, allCheckStatus: allCheckStatus },
  });
  console.log('🚀 ~ updateAllCheckStatus ~ res:', res);
  if (res.code === 1) return res;
  if (res?.code === -1) return res;
};

export const updateQuantity = async data => {
  console.log('🚀 ~ updateQuantity ~ data:', data);
  const res = await fetchData.put(`api/v1/cart/update/quantity`, {
    body: { cartId: data.cartId, quantity: data.quantity },
  });
  if (res.code === 1) return res;
  console.log('🚀 ~ updateQuantity ~ res:', res);
  if (res?.code === -1) return res;
};

export const deleteCart = async cartId => {
  console.log('🚀 ~ deleteCart ~ cartId:', cartId);
  const res = await fetchData.delete(`api/v1/cart/delete/${cartId}`);
  console.log('🚀 ~ deleteCart ~ res:', res);
  if (res.code === 1) return res;
  if (res?.code === -1) return res;
};
