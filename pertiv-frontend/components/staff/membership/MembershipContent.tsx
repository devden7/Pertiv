import { IMembershipType } from '@/model/staff.model';
import AddMembership from './AddMembership';
import SearchInput from '@/components/shared/SearchInput';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import MembershipList from './MembershipList';

interface Props {
  data: IMembershipType[];
  token?: string;
  page: number;
  pageSize: number;
  totalCount: number;
}

const MembershipContent = ({ data, token }: Props) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Membership</h2>
          <p className=" text-slate-500 mb-3">
            As a Staff, you can manage these membership types
          </p>
        </div>
        <AddMembership token={token} />
      </div>
      <SearchInput placeholder="Search by Name" path="/staff/membership" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">NAME</TableHead>
            <TableHead className="text-center">DESCRIPTION</TableHead>
            <TableHead className="text-center">DURATION DAYS</TableHead>
            <TableHead className="text-center">MAX BORROW (BOOK)</TableHead>
            <TableHead className="text-center">MAX RETURN (DAY)</TableHead>
            <TableHead className="text-center">PRICE</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <MembershipList data={data} token={token} />
      </Table>
    </section>
  );
};

export default MembershipContent;
