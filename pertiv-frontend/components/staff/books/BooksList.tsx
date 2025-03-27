import React from 'react';
import BookItem from './BookItem';
import { IBooksSelling } from '@/model/staff.model';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table';

interface Props {
  data: IBooksSelling[];
  token: string;
}

const BooksList = ({ data, token }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IMAGE</TableHead>
          <TableHead>TITLE</TableHead>
          <TableHead className="text-center">LANGUAGE</TableHead>
          <TableHead className="text-center">STOCK</TableHead>
          <TableHead className="text-center">PRICE </TableHead>
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
            id={item.id}
            title={item.title}
            description={item.description}
            language={item.language}
            stock={item.stock}
            imageUrl={item.imageUrl}
            price={item.price}
            created_at={item.created_at}
            user_id={item.user_id}
            publisher={item.publisher}
            writer={item.writer}
            token={token}
            category={item.category}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default BooksList;
