import { fetchData } from '../instance';

export const userLogin = async data => {
  const response = await fetchData.post(`api/v1/auth/login`, {
    body: JSON.stringify(data),
  });
  return response;
};

export const findId = async data => {
  const response = await fetchData.post(`api/v1/auth/find-id`, {
    body: JSON.stringify(data),
  });
  if (response.code === 1) {
    return response;
  }
  if (response.code === -1) {
    console.log('🚀 ~ findId ~ response:', response);
    return response;
  }
};

export const findPassword = async data => {
  console.log('🚀 ~ findPassword ~ data:', data);
  const response = await fetchData.post(`api/v1/auth/find-pw`, {
    body: JSON.stringify(data),
  });
  console.log('🚀 ~ findPassword ~ response:', response);
  return response;
};

export const kakaoLoginCheck = async ({ email, nickname }) => {
  const qs = new URLSearchParams({
    email: String(email).trim(),
    nickname: String(nickname || '').trim(),
  });
  console.log('🚀 ~ kakaoLoginCheck ~ email, nickname:', email, nickname);
  console.log('🚀 ~ kakaoLoginCheck ~ qs:', qs);

  const url = `api/v1/auth/kakao/login?${qs.toString()}`;

  const res = await fetchData.get(url);

  return res;
};

export const getNaverLogin = async ({ code, state }) => {
  console.log('🚀 ~ getNaverLogin ~ code, state:', code, state);
  const qs = new URLSearchParams({
    code: String(code).trim(),
    state: String(state || '').trim(),
  });
  const response = await fetchData.get(
    `api/v1/auth/naver/callback?${qs.toString()}`,
  );
  console.log('🚀 ~ getNaverLogin ~ response:', response);
  return response;
};
