import { fetchData } from '../instance';

export const createReview = async review => {
  console.log('🚀 ~ createReview ~ review:', review);
  const response = await fetchData.post('api/v1/my/review/create', {
    body: JSON.stringify(review),
  });
  console.log('🚀 ~ createReview ~ response:', response);
  return response;
};

export const getReviewWriteList = async (userCode, page = 0, size = 8) => {
  console.log(
    '🚀 ~ getReviewWriteList ~ userCode, page, size = 8:',
    userCode,
    page,
    (size = 8),
  );
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

export const getProductsReviewList = async (productId, page, sort) => {
  const response = await fetchData.get(
    `api/v1/product/review/${productId}/${page}?sortBy=${sort}`,
  );
  console.log('🚀 ~ getProductReviewList ~ response:', response.data);
  if (response.code === 1) {
    return response.data;
  }
};

export const deleteReview = async (reviewId, userCode) => {
  const response = await fetchData.delete(
    `api/v1/my/review/delete/${reviewId}?userCode=${userCode}`,
  );
  console.log('🚀 ~ deleteReview ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    return response;
  }
};
