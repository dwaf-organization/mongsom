import { fetchData } from '../instance';

export const getQnAList = async ({ page = 0, size = 10 }) => {
  const qurery = new URLSearchParams();
  qurery.set('page', String(page));
  qurery.set('size', String(size));

  const url = `api/v1/qna/list??${qurery.toString()}`;
  console.log('GET:', url);

  const reponse = await fetchData.get(url);
  return reponse;
};

export const getQnADetail = async id => {
  const url = `api/v1/qna/detail?qnaCode=${id}`;
  console.log('GET:', url);

  const reponse = await fetchData.get(url);
  return reponse;
};
