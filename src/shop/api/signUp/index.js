import { fetchData } from '../instance';

export const signUp = async data => {
  console.log('🚀 ~ signUp ~ data:', data);
  const response = await fetchData.post(`api/v1/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ signUp ~ response:', response);
  return response;
};

export const checkId = async userId => {
  const response = await fetchData.get(
    `api/v1/auth/duplication-check?userId=${encodeURIComponent(userId)}`,
  );
  return response;
};
