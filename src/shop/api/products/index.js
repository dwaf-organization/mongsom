import { fetchData } from '../instance';

export const getAllProductList = async (sort = 'all', page = 1) => {
  const params = {
    sort,
    page,
  };
  console.log('🚀 ~ getAllProductList ~ sort:', sort);
  console.log('🚀 ~ getAllProductList ~ page:', page);

  const response = await fetchData.get(
    `api/v1/product/${params.sort}/${params.page}`,
  );
  console.log('🚀 ~ getAllProductList ~ response:', response);
  return response.data;
};

// export const getAllProductList = async (sort = 'all', page = 1) => {
//   const response = await fetchData.get(`api/v1/product/all/1`);
//   console.log('🚀 ~ getAllProductList ~ response:', response);
//   return response.data;
// };
