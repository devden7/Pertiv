import { IBookForBorrowing, IBookForSelling } from '@/model/user.model';
import React from 'react';
import BooksItem from './BooksItem';
import Link from 'next/link';

interface Props {
  title: string;
  url: string;
  detailUrl: string;
  token?: string;
  books: IBookForSelling[] | IBookForBorrowing[];
}
const BooksHomePage = ({ title, url, detailUrl, token, books }: Props) => {
  return (
    <section className="mt-5">
      <div className="container">
        <div className="flex justify-between">
          <h2 className="font-semibold mb-2 text-lg">{title}</h2>
          <Link href={url} className="text-sm text-primary-500">
            Show more...
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {books.map((book) => (
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
