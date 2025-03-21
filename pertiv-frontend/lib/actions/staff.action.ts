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

export const updateBookSelling = async (
  id: string,
  values: FormData,
  token?: string
) => {
  console.log(values);
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/update-book-selling/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values,
      }
    );
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

export const deleteBookSelling = async (id: string, token?: string) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/delete-book-selling/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from deleteStaff action', error);
  }
};

export const getTransactions = async (token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/staff/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookCart action ', error);
  }
};
