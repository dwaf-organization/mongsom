import { fetchData } from '../instance';

export const createProduct = async product => {
  console.log('🚀 ~ createProduct ~ product:', product);
  const response = await fetchData.post('api/v1/admin/product/regist', {
    body: JSON.stringify(product),
  });
  console.log('🚀 ~ createProduct ~ response:', response);
  return response.data;
};

export const getProductList = async ({
  page = 1,
  size = 5,
  name = '',
  premium = 2,
}) => {
  const qs = new URLSearchParams();
  if (name) qs.set('name', name);
  qs.set('premium', String(premium));
  qs.set('size', String(size));

  const url = `api/v1/admin/product/select/list/${page}?${qs.toString()}`;
  console.log('GET:', url);
  const res = await fetchData.get(url);
  console.log('🚀 ~ getProductList ~ res:', res);
  return res;
};

export const getProductDetail = async id => {
  const response = await fetchData.get(
    `api/v1/admin/product/select/detail/${id}`,
  );
  console.log('🚀 ~ getProductDetail ~ response:', response);
  return response.data;
};

export const updateProduct = async (id, product) => {
  console.log('🚀 ~ updateProduct ~ product:', product);
  const response = await fetchData.put(`api/v1/admin/product/update/${id}`, {
    body: JSON.stringify(product),
  });
  console.log('🚀 ~ updateProduct ~ response:', response);
  return response.data;
};

export const deleteProduct = async productId => {
  console.log('🚀 ~ deleteProduct ~ productId:', productId);
  const response = await fetchData.put(
    `api/v1/admin/product/delete/${productId}`,
  );
  console.log('🚀 ~ deleteProduct ~ response:', response);
  if (response.code === 1) {
    return response;
  }
  if (response.code !== 1) {
    return response;
  }
};
