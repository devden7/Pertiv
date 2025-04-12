import LogContent from '@/components/admin/log/LogContent';
import { getLogs } from '@/lib/actions/admin/admin.action';
import { getUserToken } from '@/lib/actions/auth.action';
import { notFound } from 'next/navigation';
import React from 'react';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const Log = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return notFound();
  }
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const SIZE = 20;

  const data = await getLogs(search, page, user.token);
  return (
    <LogContent
      data={data.data}
      page={page}
      pageSize={SIZE}
      totalCount={data.totalCount}
    />
  );
};

export default Log;
