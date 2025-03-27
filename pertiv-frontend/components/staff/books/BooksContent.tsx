import React from 'react';
import { IBooksSelling } from '@/model/staff.model';
import BooksList from './BooksList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import AddBook from './AddBook';
import SearchInput from '@/components/shared/SearchInput';

interface Props {
  data: IBooksSelling[];
  token: string;
  page: number;
  pageSize: number;
  totalCount: number;
}
const BooksContent = ({ data, token, page, pageSize, totalCount }: Props) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Books</h2>
          <p className=" text-slate-500 mb-3">
            As a Staff, you can manage this book collection.
          </p>
        </div>
        <AddBook token={token} />
      </div>
      <SearchInput placeholder="Search by Book Title" path="/staff/books" />
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
    </section>
  );
};

export default BooksContent;
