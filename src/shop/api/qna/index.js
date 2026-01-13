import { fetchData } from '../instance';

export const getQnAList = async ({ page = 0, size = 10 }) => {
  const qurery = new URLSearchParams();
  qurery.set('page', String(page));
  qurery.set('size', String(size));

  const url = `api/v1/qna/list?${qurery.toString()}`;
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

export const updateQnA = async ({
  qnaCode,
  userCode,
  qnaTitle,
  qnaContents,
  orderId,
  lockStatus,
}) => {
  const url = `api/v1/qna/update`;
  console.log('PUT:', url);

  const reponse = await fetchData.put(url, {
    body: {
      qnaCode: qnaCode,
      userCode: userCode,
      qnaTitle: qnaTitle,
      qnaContents: qnaContents,
      orderId: orderId,
      lockStatus: lockStatus,
    },
  });
  return reponse;
};

export const deleteQnA = async ({ qnaCode, userCode }) => {
  const url = `api/v1/qna/delete/${userCode}/${qnaCode}`;
  console.log('DELETE:', url);

  const reponse = await fetchData.delete(url);
  return reponse;
};

export const getProductQnAList = async ({
  productCode,
  page = 0,
  size = 10,
}) => {
  const qurery = new URLSearchParams();
  qurery.set('page', String(page));
  qurery.set('size', String(size));

  const url = `api/v1/qna/product/list?productId=${productCode}&${qurery.toString()}`;
  console.log('GET:', url);

  const reponse = await fetchData.get(url);
  return reponse;
};

export const createQnA = async ({
  userCode,
  productId,
  productName,
  qnaTitle,
  orderId,
  lockStatus,
  qnaContents,
}) => {
  const url = `api/v1/qna/create`;
  console.log('POST:', url);

  const reponse = await fetchData.post(url, {
    body: {
      userCode: userCode,
      productId: productId,
      productName: productName,
      qnaTitle: qnaTitle,
      qnaContents: qnaContents,
      orderId: orderId,
      lockStatus: lockStatus,
    },
  });
  return reponse;
};
