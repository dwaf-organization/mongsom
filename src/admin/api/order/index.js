// api/order.js
import { fetchData } from '../instance';

export const getOrderList = async ({
  page = 1,
  size = 10,
  startDate,
  endDate,
  orderId,
}) => {
  const clamp = d => {
    const [y, m, dy] = d.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    const safe = Math.min(dy, last);
    return `${y}-${String(m).padStart(2, '0')}-${String(safe).padStart(2, '0')}`;
  };
  const s = clamp(startDate);
  const e = clamp(endDate);

  const qs = new URLSearchParams();
  if (s) qs.set('startDate', s);
  if (e) qs.set('endDate', e);
  if (orderId) qs.set('orderId', String(orderId).trim());

  const url = `api/v1/admin/order/list/${page}/${size}?${qs.toString()}`;
  console.log('🚀 ~ getOrderList ~ url:', url);
  const res = await fetchData.get(url);
  console.log('🚀 ~ getOrderList ~ res:', res);

  return res;
};

export const getOrderDetail = async orderId => {
  const response = await fetchData.get(`api/v1/admin/order/detail/${orderId}`);
  console.log('🚀 ~ getOrderDetail ~ response:', response);
  return response;
};

export const updateOrderStatus = async data => {
  console.log('🚀 ~ updateOrderStatus ~ data:', data);
  const response = await fetchData.put(`api/v1/admin/order/delivery/update`, {
    body: JSON.stringify(data),
  });
  return response;
};

export const cancelOrder = async data => {
  console.log('🚀 ~ cancelOrder ~ data:', data);
  const response = await fetchData.post(`api/v1/order/cancel`, {
    body: JSON.stringify(data),
  });
  return response;
};
