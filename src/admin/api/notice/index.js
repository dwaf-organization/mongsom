import { fetchData } from '../instance';

export const createNotice = async notice => {
  console.log('🚀 ~ createNotice ~ notice:', notice);
  const response = await fetchData.post('api/v1/admin/notice/create', {
    body: JSON.stringify(notice),
  });
  console.log('🚀 ~ createNotice ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response.data;
  }
};
