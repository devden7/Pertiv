import Books from '@/components/shared/Books';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksBorrowingUser } from '@/lib/actions/user.action';
import React from 'react';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const BooksBorrowing = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const SIZE = 20;
  const data = await getBooksBorrowingUser(search, page, SIZE);
  return (
    <Books
      titlePage="Books For borrow"
      data={data.data}
      detailUrl="/book-borrowing"
      token={user ? user.token : undefined}
      type="/books-borrowing"
      page={page}
      pageSize={SIZE}
      totalCount={data.totalCount}
    />
  );
};

export default BooksBorrowing;
