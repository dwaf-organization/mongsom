import { fetchData } from '../instance';

export const getUserList = async ({ page, size }) => {
  const response = await fetchData.get(
    `api/v1/admin/user/list/${page}/${size}`,
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
