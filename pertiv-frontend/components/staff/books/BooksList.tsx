import React from 'react';
import BookItem from './BookItem';
import { IBooksBorrowing, IBooksSelling } from '@/model/staff.model';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table';

interface Props {
  data: IBooksSelling[] | IBooksBorrowing[];
  token: string;
  mode: string;
}

const BooksList = ({ data, token, mode }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IMAGE</TableHead>
          <TableHead>TITLE</TableHead>
          <TableHead className="text-center">LANGUAGE</TableHead>
          <TableHead className="text-center">STOCK</TableHead>
          {mode !== 'bookBorrowing' && (
            <TableHead className="text-center">PRICE </TableHead>
          )}
          {mode === 'bookBorrowing' && (
            <TableHead className="text-center">BOOK POSITION</TableHead>
          )}
          <TableHead className="text-center">PUBLISHER</TableHead>
          <TableHead className="text-center">WRITER</TableHead>
          <TableHead className="text-center">CATEGORY</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <BookItem
            key={item.id}
            item={{ ...item }}
            token={token}
            mode={mode}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default BooksList;
