import React from 'react';
import BookItem from './BookItem';
import { IBooksSelling } from '@/model/staff.model';

interface Props {
  data: IBooksSelling[];
}

const BooksList = ({ data }: Props) => {
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
          publisher_id={item.publisher_id}
          writed_id={item.writed_id}
        />
      ))}
    </div>
  );
};

export default BooksList;
