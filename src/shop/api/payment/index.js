import { fetchData } from '../instance';

export const paymentConfirm = async ({ orderId, paymentKey, amount }) => {
  const res = await fetchData.post('api/v1/payment/confirm', {
    body: JSON.stringify({ orderId, paymentKey, amount }),
  });
  return res;
  //   if (res.code === 1) {
  //     return res;
  //   }
};
