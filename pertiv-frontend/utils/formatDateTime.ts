import { format } from 'date-fns';

export const formatDateTime = (time: string | Date) => {
  if (!time) return '-';
  const result = format(time, ' dd MMM yyyy • HH:mm ');

  return result;
};
