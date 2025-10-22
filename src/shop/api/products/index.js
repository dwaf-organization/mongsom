import { fetchData } from '../instance';

// export const getAllProductList = async (sort = 'all', page = 1) => {
//   const params = {
//     sort,
//     page,
//   };
//   console.log('🚀 ~ getAllProductList ~ sort:', sort);

//   const response = await fetchData.get(
//     `api/v1/product/${params.sort}/${params.page}`,
//   );
//   console.log('🚀 ~ getAllProductList ~ response:', response);
//   return response.data;
// };

export const getAllProductList = async (sort = 'all', page = 1, opts = {}) => {
  const base = `api/v1/product/${sort}/${page}`;
  const url =
    sort === 'popular' && opts.size
      ? `${base}/${encodeURIComponent(opts.size)}`
      : base;
  console.log('🚀 ~ getAllProductList ~ url:', url);

  const response = await fetchData.get(url);
  console.log('🚀 ~ getAllProductList ~ response:', response);
  return response.data; // { items, pagination } 형태라고 했던 그 data
};

export const getProductDetail = async id => {
  const response = await fetchData.get(`api/v1/product/${id}`);
  console.log('🚀 ~ getProductDetail ~ response:', response);
  if (response.code === 1) {
    return response.data;
  }
  if (response.code === -1) {
    return response;
  }
};
