import { fetchData } from '../instance';

export const getUserInfo = async userCode => {
  const response = await fetchData.get(`api/v1/auth/${userCode}`);
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
  if (response.code === 1) {
    return response.data;
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
