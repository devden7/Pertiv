'use server';

import { ENV } from '@/utils/config';
import { revalidatePath } from 'next/cache';

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

export const getBookSellingDetail = async (id: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/book-selling/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBooksSelling action ', error);
  }
};

export const addBookToCart = async (bookId: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from addBookToCart action ', error);
  }
};

export const getBookCart = async () => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/cart`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookCart action ', error);
  }
};

export const removeBookFromCart = async (bookId: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/remove-item-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from removeBookFromCart action ', error);
  }
};

export const decreaseBookFromCart = async (bookId: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/decrease-item-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from decreaseBookFromCart action ', error);
  }
};
