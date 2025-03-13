'use client';

import { toast } from '@/hooks/use-toast';
import React from 'react';

interface Props {
  type: string;
}
const Toast = ({ type }: Props) => {
  if (type === 'internal error') {
    toast({
      variant: 'destructive',
      title: 'Oh! Something went wrong!',
      description: 'Internal server error',
    });
  }
  return <div>Toast</div>;
};

export default Toast;
