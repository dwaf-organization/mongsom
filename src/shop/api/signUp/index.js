import { fetchData } from '../instance';

export const signUp = async data => {
  const response = await fetchData.post(`/api/v1/auth/sign-up`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const checkId = async data => {
  const response = await fetchData.post(`/api/v1/auth/dup-check/${data}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
