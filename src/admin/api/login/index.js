import { fetchData } from '../instance';

export const userLogin = async data => {
  const response = await fetchData.post(`api/v1/admin/auth/login`, {
    body: JSON.stringify(data),
  });
  return response;
};
