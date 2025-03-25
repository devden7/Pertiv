import {
  endOfDay,
  endOfYesterday,
  formatISO,
  startOfDay,
  startOfYesterday,
  subDays,
  subHours,
} from 'date-fns';

export const getTimeFilter = (period: string) => {
  const now = new Date();
  switch (period) {
    case 'last_hour':
      return { start: formatISO(subHours(now, 1)), end: formatISO(now) };
    case 'yesterday':
      return {
        start: formatISO(startOfYesterday()),
        end: formatISO(endOfYesterday()),
      };
    case 'last_7_days':
      return { start: formatISO(subDays(now, 7)), end: formatISO(now) };
    case 'last_30_days':
      return { start: formatISO(subDays(now, 30)), end: formatISO(now) };
    default:
      return {
        start: formatISO(startOfDay(now)),
        end: formatISO(endOfDay(now)),
      };
  }
};
