'use server';

import { ENV } from '@/utils/config';
import { revalidatePath } from 'next/cache';

export const getBooksSelling = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/books-selling?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
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

export const getTransactions = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/transactions?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookCart action ', error);
  }
};

export const confirmOrderTransaction = async (
  orderKey: string,
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/staff/confirm-order`, {
      method: 'POST',
      body: JSON.stringify({ orderKey }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from confirmOrderTransaction action ', error);
  }
};

export const dashboard = async (
  startDate: string,
  endDate: string,
  filter: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/dashboard?start=${encodeURIComponent(
        startDate
      )}&end=${encodeURIComponent(endDate)}&filter=${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookCart action ', error);
  }
};

export const addBookBorrowing = async (values: FormData, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/staff/add-book-borrowing`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: values,
    });
    const data = await response.json();
    if (data.statusCode === 500) {
      throw response;
    }
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from addBookBorrowing action ', error);
  }
};

export const getBooksBorrowing = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/books-borrowing?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    if (data.statusCode === 500) {
      throw response;
    }
    return data;
  } catch (error) {
    console.log('Error from getBooksSelling action ', error);
  }
};

export const updateBookBorrowing = async (
  id: string,
  values: FormData,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/update-book-borrowing/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values,
      }
    );
    const data = await response.json();

    if (data.statusCode === 500) {
      throw response;
    }

    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from updateBookBorrowing action ', error);
  }
};

export const deleteBookBorrowing = async (id: string, token?: string) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/delete-book-borrowing/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.statusCode === 500) {
      throw response;
    }
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from deleteStaff action', error);
  }
};

export const getBorrowTransactions = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/borrow-transactions?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookCart action ', error);
  }
};

export const acceptLoanBook = async (bookId: string, token?: string) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/staff/accept-loan-book/${bookId}`,
      {
        method: 'POST',
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
    console.log('Error from purchaseBook action ', error);
  }
};
