import { fetchData } from '../instance';

export const getReviewAllList = async (page = 0) => {
  const response = await fetchData.get(
    `api/v1/my/review/all?page=${page}&size=10`,
  );
  return response;
};

export const createReviewAnswer = async (reviewId, adminAnswer) => {
  const response = await fetchData.put(`api/v1/review/answer/write`, {
    body: { reviewId: reviewId, adminAnswer: adminAnswer },
  });
  return response;
};

export const hiddenReview = async (hiddenStatus, reviewId) => {
  const response = await fetchData.put(
    `api/v1/my/review/${hiddenStatus}/${reviewId}`,
  );
  return response;
};

export const deleteReview = async reviewId => {
  const response = await fetchData.delete(
    `api/v1/my/review/delete/${reviewId}`,
  );
  return response;
};
