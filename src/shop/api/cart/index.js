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
  if (res?.code !== 1) return [];
  return Array.isArray(res?.data?.items) ? res.data.items : [];
};

export const updateCheckStatus = async data => {
  const res = await fetchData.put(`api/v1/cart/change/check`, {
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ updateCheckStatus ~ res:', res);
  if (res.code === 1) return res;
  if (res?.code === -1) return;
};

export const updateQuantity = async data => {
  const res = await fetchData.put(`api/v1/cart/update/quantity`, {
    body: JSON.stringify(data),
  });
  if (res.code === 1) return res;
  console.log('🚀 ~ updateQuantity ~ res:', res);
  if (res?.code === -1) return res;
};

export const deleteCart = async (userCode, productId, optId) => {
  console.log(
    '🚀 ~ deleteCart ~ userCode, productId, optId:',
    userCode,
    productId,
    optId,
  );
  const res = await fetchData.delete(
    `api/v1/cart/delete/${userCode}/${productId}/${optId}`,
  );
  console.log('🚀 ~ deleteCart ~ res:', res);
  if (res.code === 1) return res;
  if (res?.code === -1) return res;
};
