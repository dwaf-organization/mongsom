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

export const getNotice = async (page, size) => {
  const res = await fetchData.get(`api/v1/notice/list/${page}?size=${size}`);
  return res.data;
};

export const getNoticeDetail = async noticeId => {
  console.log('🚀 ~ getNoticeDetail ~ noticeId:', noticeId);
  const res = await fetchData.get(`api/v1/notice/detail/${noticeId}`);
  console.log('🚀 ~ getNoticeDetail ~ res:', res);
  if (res.code === 1) {
    return res.data;
  }

  if (res.code === -1) {
    return res;
  }
  return res.data;
};

export const deleteNotice = async noticeId => {
  console.log('🚀 ~ deleteNotice ~ noticeId:', noticeId);
  const res = await fetchData.delete(`api/v1/admin/notice/delete/${noticeId}`);
  console.log('🚀 ~ deleteNotice ~ res:', res);
  return res;
};

export const updateNotice = async (noticeId, data) => {
  console.log('🚀 ~ updateNotice ~ noticeId, notice:', noticeId, data);
  const response = await fetchData.put(
    `api/v1/admin/notice/update/${noticeId}`,
    {
      body: JSON.stringify(data),
    },
  );
  console.log('🚀 ~ updateNotice ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};
