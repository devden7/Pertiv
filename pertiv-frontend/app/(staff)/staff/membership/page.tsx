import React from 'react';
import MembershipContent from '@/components/staff/membership/MembershipContent';
import { getUserToken } from '@/lib/actions/auth.action';

const Membership = async () => {
  const user = await getUserToken();
  if (!user) {
    return;
  }
  return <MembershipContent token={user.token} />;
};

export default Membership;
