import { fetchData } from '../instance';

export const inquire = async data => {
  console.log('🚀 ~ inquire ~ data:', data);
  const response = await fetchData.post(`api/v1/inquiry/create`, {
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
