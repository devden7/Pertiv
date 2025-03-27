import React from 'react';
import { IBooksSelling } from '@/model/staff.model';
import BooksList from './BooksList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';

interface Props {
  data: IBooksSelling[];
  token: string;
  page: number;
  pageSize: number;
  totalCount: number;
}
const BooksContent = ({ data, token, page, pageSize, totalCount }: Props) => {
  return (
    <div>
      <div>
        {data.length === 0 && <p> no books </p>}
        {data.length > 0 && <BooksList data={data} token={token} />}
        {totalCount > 0 && (
          <div className="my-3">
            <PaginationWithLinks
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksContent;
