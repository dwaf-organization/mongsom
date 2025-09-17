import { fetchData } from '../instance';

export const addCart = async cart => {
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
