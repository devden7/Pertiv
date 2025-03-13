import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IStaff } from '@/model/admin.module';
import TableList from './TableList';

interface Props {
  data: IStaff[];
}

const TableContent = ({ data }: Props) => {
  return (
    <section className="container">
      <h1 className="text-xl font-semibold">List staff</h1>
      <Table>
        <TableCaption>A list of your staffs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableList data={data} />
      </Table>
    </section>
  );
};

export default TableContent;
