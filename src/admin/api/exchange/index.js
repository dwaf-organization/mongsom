import { fetchData } from '../instance';

export const getExchangeList = async (changeStatus, page) => {
  const response = await fetchData.get(
    `api/v1/admin/product/change/list/${changeStatus}/${page}/10`,
  );
  console.log('🚀 ~ getExchangeList ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};

export const changeExchangeStatus = async (changeId, newStatus) => {
  const response = await fetchData.put(`api/v1/admin/product/change/status`, {
    body: { changeId: changeId, newStatus: newStatus },
  });
  console.log('🚀 ~ changeExchangeStatus ~ response:', response);
  return response;
};

export const getExchangeDetail = async changeId => {
  const response = await fetchData.get(
    `api/v1/admin/product/change/detail/${changeId}`,
  );
  console.log('🚀 ~ getExchangeDetail ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};
