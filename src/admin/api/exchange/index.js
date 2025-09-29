import { fetchData } from '../instance';

export const getExchangeList = async (changeStatus, page) => {
  const response = await fetchData.get(
    `api/v1/admin/change/list/${changeStatus}/${page}`,
  );
  return response;
};
