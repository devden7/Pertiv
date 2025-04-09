'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  IAreaChart,
  TransactionsBookBorrowing,
  TransactionsBookSelling,
} from '@/model/staff.model';
import { useEffect, useState } from 'react';

const chartConfig = {
  bookSelling: {
    label: 'BookSelling',
    color: 'hsl(var(--chart-1))',
  },
  bookBorrowing: {
    label: 'BookBorrowing',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface Props {
  data: IAreaChart;
  timePeriod: string;
}
const AreaChartContent = ({ data, timePeriod }: Props) => {
  const [chartData, setChartData] = useState<
    { time: string; bookSelling: number; bookBorrowing: number }[]
  >([]);

  useEffect(() => {
    const arr = [
      ...data.transactionsBookSelling,
      ...data.transactionBookBorrowing,
    ];
    const newData = arr.map((item) => {
      return {
        time: item.time,
        bookSelling: (item as TransactionsBookSelling).bookSelling || 0,
        bookBorrowing: (item as TransactionsBookBorrowing).bookBorrowing || 0,
      };
    });
    setChartData(newData);
  }, [data, timePeriod]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Showing all transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square max-h-[203px]"
        >
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (timePeriod === 'yesterday') return value.slice(0, 7);
                return value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="bookSelling"
              type="natural"
              fill="var(--color-bookSelling)"
              fillOpacity={0.4}
              stroke="var(--color-bookSelling)"
              stackId="a"
            />
            <Area
              dataKey="bookBorrowing"
              type="natural"
              fill="var(--color-bookBorrowing)"
              fillOpacity={0.4}
              stroke="var(--color-bookBorrowing)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartContent;
