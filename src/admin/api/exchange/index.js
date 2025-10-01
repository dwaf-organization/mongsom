import { fetchData } from '../instance';

export const getExchangeList = async (changeStatus, page) => {
  const response = await fetchData.get(
    `api/v1/admin/product/change/list/${changeStatus}/${page}`,
  );
  console.log('🚀 ~ getExchangeList ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};

export const changeExchangeStatus = async (changeId, approvalStatus) => {
  const response = await fetchData.put(`api/v1/admin/product/change/update`, {
    body: JSON.stringify({ changeId, approvalStatus }),
  });
  console.log('🚀 ~ changeExchangeStatus ~ response:', response);
  return response;
};
