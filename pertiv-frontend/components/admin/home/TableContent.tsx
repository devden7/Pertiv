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
import DataNotFound from '@/components/shared/DataNotFound';
import SearchInput from '@/components/shared/SearchInput';

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
        <SearchInput
          placeholder="Search by Name or Email"
          path={page ? `/admin?page=${page}` : '/admin'}
        />
        {data.length === 0 && <DataNotFound data={data} />}
        {data.length !== 0 && (
          <Table>
            <TableCaption>A list of your staffs.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Action</TableHead>
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
