import { format } from 'date-fns';

export const formatDateTime = (time: string | Date) => {
  const result = format(time, ' dd MMM yyyy • HH:mm ');

  return result;
};
