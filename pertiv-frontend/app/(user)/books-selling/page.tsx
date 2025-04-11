import Books from '@/components/shared/Books';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBooksSellingUser } from '@/lib/actions/user.action';
import React from 'react';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const BooksSelling = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const SIZE = 20;
  const data = await getBooksSellingUser(search, page, SIZE);
  return (
    <Books
      titlePage="Books For buy"
      data={data.data}
      detailUrl="/book-selling"
      token={user ? user.token : undefined}
      type="/books-selling"
      page={page}
      pageSize={SIZE}
      totalCount={data.totalCount}
    />
  );
};

export default BooksSelling;
