'use server';

import { ENV } from '@/utils/config';

export const getBooksSelling = async (token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/staff/books-selling`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBooksSelling action ', error);
  }
};
