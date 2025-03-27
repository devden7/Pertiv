import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IStaff } from '@/model/admin.model';
import TableList from './TableList';
import AddStaff from './AddStaff';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';

interface Props {
  data: IStaff[];
  token?: string;
  page: number;
  pageSize: number;
  totalCount: number;
}

const TableContent = ({ data, token, page, pageSize, totalCount }: Props) => {
  return (
    <>
      <section className="container">
        <h1 className="text-xl font-semibold">List staff</h1>
        <p className="text-sm text-slate-500 mb-3">all list of staffs</p>
        <AddStaff token={token} />
        {data.length === 0 && <p className="text-center">No data</p>}
        {data.length !== 0 && (
          <Table>
            <TableCaption>A list of your staffs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableList data={data} token={token} />
          </Table>
        )}
      </section>
      {totalCount > 0 && (
        <div className="my-3">
          <PaginationWithLinks
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </div>
      )}
    </>
  );
};

export default TableContent;
