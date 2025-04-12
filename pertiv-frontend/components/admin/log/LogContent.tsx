import DataNotFound from '@/components/shared/DataNotFound';
import { ILogs } from '@/model/admin.model';
import React from 'react';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LogList from './LogList';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import SearchInput from '@/components/shared/SearchInput';

interface Props {
  data: ILogs[];
  page: number;
  pageSize: number;
  totalCount: number;
}
const LogContent = ({ data, page, pageSize, totalCount }: Props) => {
  return (
    <>
      <section className="container">
        <h1 className="text-xl font-semibold">Logs</h1>
        <SearchInput
          placeholder="Search by Level or Message"
          path={page ? `/admin/log?page=${page}` : '/admin/log'}
        />
        {data.length === 0 && <DataNotFound data={data} />}
        {data.length !== 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">LEVEL</TableHead>
                <TableHead className="text-center">MESSAGE</TableHead>
                <TableHead className="text-center">DATE</TableHead>
              </TableRow>
            </TableHeader>
            <LogList data={data} />
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

export default LogContent;
