import { fetchData } from '../instance';

export const createReview = async review => {
  console.log('🚀 ~ createReview ~ review:', review);
  const response = await fetchData.post('api/v1/my/review/create', {
    body: JSON.stringify(review),
  });
  console.log('🚀 ~ createReview ~ response:', response);
  return response.data;
};

export const getReviewWriteList = async (userCode, page, size = 8) => {
  const response = await fetchData.get(
    `api/v1/my/review/${userCode}/${page}/${size}`,
  );
  console.log('🚀 ~ getReviewWriteList ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};

export const getCompletedReviewList = async (userCode, page, size = 8) => {
  const response = await fetchData.get(
    `api/v1/my/review/write/${userCode}/${page}/${size}`,
  );
  console.log('🚀 ~ getCompletedReviewList ~ response:', response.data);
  if (response.code === 1) {
    return response.data;
  }
};
