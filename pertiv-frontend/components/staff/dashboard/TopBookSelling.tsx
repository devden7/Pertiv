import React from 'react';
import { BookBorrowingSale, BookSellingSale } from '@/model/staff.model';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TableBooksSellingSales from './TableBooksSellingSales';
interface Props {
  data: BookSellingSale[] | BookBorrowingSale[];
  type: string;
  title: string;
  description: string;
}
const TopBookSelling = ({ data, type, title, description }: Props) => {
  return (
    <Card className="flex flex-col mt-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <TableBooksSellingSales data={data} type={type} />
      </CardContent>
    </Card>
  );
};

export default TopBookSelling;
