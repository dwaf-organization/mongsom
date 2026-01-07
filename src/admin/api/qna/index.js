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

export const deleteQnA = async ({ qnaCode, userCode }) => {
  const url = `api/v1/qna/delete/${userCode}/${qnaCode}`;
  console.log('DELETE:', url);

  const reponse = await fetchData.delete(url);
  return reponse;
};

export const answerQnA = async ({ qnaCode, answerContents }) => {
  const url = `api/v1/qna/answer`;
  console.log('put:', url);

  const reponse = await fetchData.put(url, {
    body: { qnaCode: qnaCode, answerContents: answerContents },
  });
  return reponse;
};
