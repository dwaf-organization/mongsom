import { fetchData } from '../instance';

export const userLogin = async data => {
  const response = await fetchData.post(`api/v1/auth/login`, {
    body: JSON.stringify(data),
  });
  return response;
};

export const findId = async data => {
  const response = await fetchData.post(`api/v1/auth/find-id`, {
    body: JSON.stringify(data),
  });
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    console.log('🚀 ~ findId ~ response:', response);
    return response;
  }
};

export const findPassword = async data => {
  console.log('🚀 ~ findPassword ~ data:', data);
  const response = await fetchData.post(`api/v1/auth/find-pw`, {
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ findPassword ~ response:', response);
  return response;
};
