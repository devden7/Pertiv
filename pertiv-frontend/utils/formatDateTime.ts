import { format } from 'date-fns';

export const formatDateTime = (time: string) => {
  const result = format(time, ' dd MMM yyyy, HH:mm ');

  return result;
};
