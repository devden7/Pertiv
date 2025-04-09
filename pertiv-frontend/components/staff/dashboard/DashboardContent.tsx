'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import ChartContent from './ChartContent';
import { IDashboard } from '@/model/staff.model';

const filterBy = [
  { label: 'Last Hour', path: 'last_hour' },
  { label: 'Today', path: 'today' },
  { label: 'Yesterday', path: 'yesterday' },
  { label: 'Last 7 Days', path: 'last_7_days' },
  { label: 'Last 30 Days', path: 'last_30_days' },
];

interface Props {
  filterPeriod: string;
  data: IDashboard;
  timePeriod: string;
}

const DashboardContent = ({ filterPeriod, data, timePeriod }: Props) => {
  const { replace } = useRouter();
  return (
    <Tabs
      value={filterPeriod}
      defaultValue={filterPeriod}
      onValueChange={(value) => {
        replace(`?filter=${value}`);
      }}
    >
      <TabsList className="overflow-x-auto max-w-full max-sm:pl-16">
        {filterBy.map((period) => (
          <TabsTrigger key={period.path} value={period.path}>
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={filterPeriod}>
        <ChartContent
          pieChart={data.pieChart}
          areaChart={data.areaChart}
          timePeriod={timePeriod}
          booksSelling={data.bookSellingSales}
          dataBookBorrowed={data.dataBookBorrowed}
          staffHandling={data.staffBookSellingHandle}
          loanHandling={data.staffHandlingLoan}
          returnHandling={data.staffHandlingReturn}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
