'use client';

import React, { useEffect, useState } from 'react';
import { IBooksBorrowing, IBooksSelling } from '@/model/staff.model';
import BooksList from './BooksList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import AddBook from './AddBook';
import SearchInput from '@/components/shared/SearchInput';
import DataNotFound from '@/components/shared/DataNotFound';
import { supabase } from '@/lib/actions/supabase';

interface Props {
  data: IBooksSelling[] | IBooksBorrowing[];
  token: string;
  page: number;
  pageSize: number;
  totalCount: number;
  mode: string;
}
const BooksContent = ({
  data,
  token,
  page,
  pageSize,
  totalCount,
  mode,
}: Props) => {
  const [books, setBooks] = useState<(IBooksSelling | IBooksBorrowing)[]>(data);

  useEffect(() => {
    setBooks(data);
  }, [data]);

  useEffect(() => {
    const tableName =
      mode !== 'bookBorrowing' ? 'BookSelling' : 'BookBorrowing';
    const channel = supabase
      .channel(`List books  ${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        async (payload) => {
          if (payload.eventType === 'UPDATE') {
            setBooks((prev) => {
              const arr = [...prev];
              const findData = arr.find((item) => item.id === payload.new.id);
              const findIndex = arr.findIndex(
                (item) => item.id === payload.new.id
              );
              if (findIndex !== -1) {
                arr[findIndex] = {
                  ...(findData as IBooksSelling | IBooksBorrowing),
                  stock: payload.new.stock,
                };
              }
              return arr;
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [mode]);

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
      <SearchInput
        placeholder="Search by Book Title or Customer history"
        path={
          mode && (mode === 'bookBorrowing' || mode === 'bookSelling')
            ? `/staff/books?mode=${mode}`
            : '/staff/books'
        }
      />
      <div>
        <div>
          {books.length === 0 && <DataNotFound data={books} />}
          {books.length > 0 && (
            <BooksList
              data={books as IBooksSelling[] | IBooksBorrowing[]}
              token={token}
              mode={mode}
            />
          )}
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
