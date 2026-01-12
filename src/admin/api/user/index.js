import { fetchData } from '../instance';

export const getUserList = async ({ page, size, searchItem }) => {
  const url = `api/v1/admin/user/list/${page}/${size}?searchItem=${searchItem}`;
  console.log('🚀 ~ getUserList ~ url:', url);

  const response = await fetchData.get(
    `api/v1/admin/user/list/${page}/${size}?searchItem=${searchItem}`,
  );
  console.log('🚀 ~ getUserList ~ response:', response);
  return response;
};

export const deleteUser = async userCode => {
  const response = await fetchData.post(`api/v1/auth/delete/${userCode}`);
  console.log('🚀 ~ deleteUser ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};

export const chargeMileage = async (userCode, mileage) => {
  console.log('🚀 ~ chargeMileage ~ userCode, mileage:', userCode, mileage);
  const response = await fetchData.post(`api/v1/admin/user/mileage/charge`, {
    body: { userCode: userCode, chargeAmount: mileage },
  });
  console.log('🚀 ~ chargeMileage ~ response:', response);
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
