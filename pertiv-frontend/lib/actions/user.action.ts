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
    console.log('Error from getBooksSellingUser action ', error);
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

export const addBookToCart = async (bookId: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export const getBookCart = async (token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/cart`, {
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

export const removeBookFromCart = async (bookId: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/remove-item-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export const decreaseBookFromCart = async (bookId: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/decrease-item-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export const createOrder = async (
  cartItem: { book_id: string; quantity: number }[],
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/order-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cartItem }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from createOrder action ', error);
  }
};

export const paymentOrderDetail = async (id: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/payment-detail/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from paymentOrderDetail action ', error);
  }
};

export const purchaseBook = async (bookId: string, token?: string) => {
  try {
    console.log(bookId);
    const response = await fetch(`${ENV.API_URL}/user/purchase/${bookId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from purchaseBook action ', error);
  }
};

export const cancelPurchaseBook = async (bookId: string, token?: string) => {
  try {
    console.log(bookId);
    const response = await fetch(
      `${ENV.API_URL}/user/cancel-purchase/${bookId}`,
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

export const getTransactions = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/user/transactions?page=${page}&search=${search}`,
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

export const getBooksBorrowingUser = async (limit: number) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/user/books-borrowing?limit=${limit}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBooksSellingUser action ', error);
  }
};

export const getBookBorrowingDetail = async (id: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/book-borrowing/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getBookBorrowingDetail action ', error);
  }
};

export const addBookToLoanCart = async (bookId: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/add-to-loan-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from addBookToLoanCart action ', error);
  }
};

export const getBookLoanCart = async (token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/loan-cart`, {
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

export const removeBookFromLoanCart = async (
  bookId: string,
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/remove-item-loan-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export const borrowingBook = async (
  collectionItems: { book_id: string }[],
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/borrow-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ collectionItems }),
    });
    const data = await response.json();
    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from createOrder action ', error);
  }
};

export const getBorrowTransactions = async (
  page: number,
  search: string,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/user/borrow-transactions?page=${page}&search=${search}`,
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

export const returnLoanBook = async (borrowId: string, token?: string) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/user/returned-book/${borrowId}`,
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
    console.log('Error from returnLoanBook action ', error);
  }
};
