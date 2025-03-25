import DashboardContent from '@/components/books/staff/dashboard/DashboardContent';
import { getUserToken } from '@/lib/actions/auth.action';
import { dashboard } from '@/lib/actions/staff.action';
import { getTimeFilter } from '@/utils/getTimeFilter';
interface ParamsProps {
  searchParams: { [key: string]: string };
}

const StaffHomePage = async ({ searchParams }: ParamsProps) => {
  const filterPeriod = searchParams.filter || 'today';

  const user = await getUserToken();
  if (!user) {
    return;
  }

  const { start, end } = getTimeFilter(filterPeriod);
  const data = await dashboard(
    start.toLocaleString(),
    end.toLocaleString(),
    filterPeriod,
    user.token
  );

  return (
    <>
      <DashboardContent
        filterPeriod={filterPeriod}
        data={data.data}
        timePeriod={filterPeriod}
      />
    </>
  );
};

export default StaffHomePage;
