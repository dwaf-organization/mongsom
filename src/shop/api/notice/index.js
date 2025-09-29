import { fetchData } from '../instance';

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
