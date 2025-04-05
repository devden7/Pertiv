import BookDetail from '@/components/shared/BookDetail';
import { getUserToken } from '@/lib/actions/auth.action';
import { getBookBorrowingDetail } from '@/lib/actions/user.action';
import React from 'react';

interface Params {
  params: { id: string };
}

const BookBorrowingDetail = async ({ params }: Params) => {
  const user = await getUserToken();

  const data = await getBookBorrowingDetail(params.id);

  if (!data.success && data.statusCode === 404) {
    return <h1 className="text-center">{data.message}</h1>;
  }
  return (
    <BookDetail
      type="Borrowing"
      book={{
        ...data.data,
        writerName: data.data.writer.name,
        publisherName: data.data.publisher.name,
      }}
      token={user ? user.token : undefined}
    />
  );
};

export default BookBorrowingDetail;
