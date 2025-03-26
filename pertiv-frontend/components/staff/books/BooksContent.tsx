import React from 'react';
import { IBooksSelling } from '@/model/staff.model';
import BooksList from './BooksList';

interface Props {
  data: IBooksSelling[];
  token: string;
}
const BooksContent = ({ data, token }: Props) => {
  return (
    <div>
      <div>
        {data.length === 0 && <p> no books </p>}
        {data.length > 0 && <BooksList data={data} token={token} />}
      </div>
    </div>
  );
};

export default BooksContent;
