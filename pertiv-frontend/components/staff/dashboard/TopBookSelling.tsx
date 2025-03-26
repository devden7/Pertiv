import React from 'react';
import { BookSellingSale } from '@/model/staff.model';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TableBooksSellingSales from './TableBooksSellingSales';
interface Props {
  data: BookSellingSale[];
}
const TopBookSelling = ({ data }: Props) => {
  return (
    <Card className="flex flex-col mt-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 10 Books Selling</CardTitle>
        <CardDescription>Best seller books Selling</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <TableBooksSellingSales data={data} />
      </CardContent>
    </Card>
  );
};

export default TopBookSelling;
