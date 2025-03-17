'use server';

import { ENV } from '@/utils/config';
import { revalidatePath } from 'next/cache';

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

export const addBookSelling = async (values: FormData, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/staff/add-book-selling`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: values,
    });
    const data = await response.json();

    if (response.status !== 201) {
      throw response;
    }
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from addBookSelling action ', error);
  }
};
