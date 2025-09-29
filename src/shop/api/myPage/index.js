import { fetchData } from '../instance';

export const getUserInfo = async userCode => {
  const response = await fetchData.get(`api/v1/auth/${userCode}`);
  console.log('🚀 ~ getUserInfo ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};

export const updateMyInfo = async payload => {
  console.log('🚀 ~ updateMyInfo ~ payload:', payload);
  const response = await fetchData.post(`api/v1/auth/update`, {
    body: JSON.stringify(payload),
  });
  console.log('🚀 ~ updateMyInfo ~ response:', response);
  if (response.code === 1) {
    return response;
  }
};

export const deleteUser = async userCode => {
  const response = await fetchData.post(`api/v1/auth/delete/${userCode}`);
  console.log('🚀 ~ deleteUser ~ response:', response);
  if (response.code === 1) {
    return response.code;
  }
  if (response.code === -1) {
    return response;
  }
};

export const getOrderDeliveryStatus = async userCode => {
  const response = await fetchData.get(`api/v1/my/delivery/number/${userCode}`);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};
