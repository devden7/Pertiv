import React from 'react';
import BookItem from './BookItem';
import { IBooksSelling } from '@/model/staff.model';

interface Props {
  data: IBooksSelling[];
  token: string;
}

const BooksList = ({ data, token }: Props) => {
  return (
    <div className="mb-10 flex flex-wrap items-center justify-start gap-4">
      {data.map((item) => (
        <BookItem
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          language={item.language}
          stock={item.stock}
          imageUrl={item.imageUrl}
          created_at={item.created_at}
          user_id={item.user_id}
          publisher={item.publisher}
          writer={item.writer}
          token={token}
          category={item.category}
        />
      ))}
    </div>
  );
};

export default BooksList;
