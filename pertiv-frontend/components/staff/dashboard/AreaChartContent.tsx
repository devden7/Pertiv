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
import { IAreaChart } from '@/model/staff.model';
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
    const merged: {
      time: string;
      bookSelling: number;
      bookBorrowing: number;
    }[] = [];

    data.transactionsBookSelling.forEach((item) => {
      const existing = merged.find((entry) => entry.time === item.time);
      if (existing) {
        existing.bookSelling = item.bookSelling;
      } else {
        merged.push({
          time: item.time,
          bookSelling: item.bookSelling,
          bookBorrowing: 0,
        });
      }
    });
    data.transactionBookBorrowing.forEach((item) => {
      const existing = merged.find((entry) => entry.time === item.time);
      if (existing) {
        existing.bookBorrowing = item.bookBorrowing;
      } else {
        merged.push({
          time: item.time,
          bookSelling: 0,
          bookBorrowing: item.bookBorrowing,
        });
      }
    });
    merged.sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    setChartData(merged);
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
