import React from 'react';
import MembershipContent from '@/components/staff/membership/MembershipContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { getMembershipType } from '@/lib/actions/staff.action';

interface ParamsProps {
  searchParams: { [key: string]: string };
}

const Membership = async ({ searchParams }: ParamsProps) => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  const page = parseInt(searchParams.page) || 1;
  const search = searchParams.search || '';
  const SIZE = 10;
  const data = await getMembershipType(page, search, user.token);

  return (
    <MembershipContent
      data={data.data}
      token={user.token}
      page={page}
      pageSize={SIZE}
      totalCount={data.totalCount}
    />
  );
};

export default Membership;
