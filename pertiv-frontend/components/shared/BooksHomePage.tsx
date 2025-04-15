'use client';

import { IBookForBorrowing, IBookForSelling } from '@/model/user.model';
import React, { useEffect, useState } from 'react';
import BooksItem from './BooksItem';
import Link from 'next/link';
import DataNotFound from './DataNotFound';
import { supabase } from '@/lib/actions/supabase';
import { ENV } from '@/utils/config';

interface Props {
  title: string;
  url: string;
  detailUrl: string;
  token?: string;
  books: IBookForSelling[] | IBookForBorrowing[];
}
const BooksHomePage = ({ title, url, detailUrl, token, books }: Props) => {
  const [data, setData] =
    useState<(IBookForSelling | IBookForBorrowing)[]>(books);

  useEffect(() => {
    const tableName =
      url === '/books-selling' ? 'BookSelling' : 'BookBorrowing';

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
          if (payload.eventType === 'INSERT') {
            const newBookId = payload.new.id;
            const newData =
              url === '/books-selling'
                ? await fetch(`${ENV.API_URL}/user/book-selling/${newBookId}`)
                : await fetch(
                    `${ENV.API_URL}/user/book-borrowing/${newBookId}`
                  );
            const convertData = await newData.json();
            return setData((prev) => [convertData.data, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            const oldBookId = payload.old.id;
            return setData((prev) => {
              const takeData = [...prev];
              const newData = takeData.filter((item) => item.id !== oldBookId);
              return newData;
            });
          } else {
            const oldBookId = payload.old.id;
            const newData =
              url === '/books-selling'
                ? await fetch(`${ENV.API_URL}/user/book-selling/${oldBookId}`)
                : await fetch(
                    `${ENV.API_URL}/user/book-borrowing/${oldBookId}`
                  );
            const convertData = await newData.json();
            return setData((prev) => {
              const takeData = [...prev];
              const index = takeData.findIndex((item) => item.id === oldBookId);
              if (index !== -1) {
                takeData[index] = { ...convertData.data };
              }
              return takeData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [url, setData]);
  return (
    <section className="mt-5">
      <div className="container">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-2 text-lg">{title}</h2>
          <Link href={url} className="text-sm text-primary-500">
            Show more...
          </Link>
        </div>
        {data.length === 0 && <DataNotFound data={data} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {(data.length > 5 ? data.slice(0, 5) : data).map((book) => (
            <BooksItem
              key={book.id}
              book={{ ...book }}
              detailUrl={detailUrl}
              token={token}
              type={url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BooksHomePage;
