import { ENV } from '@/utils/config';

export const getBooksSellingUser = async (limit: number) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/user/books-selling?limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBooksSelling action ', error);
  }
};
