'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label, Pie, PieChart } from 'recharts';

import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { IPieChart } from '@/model/staff.model';

interface Props {
  books: IPieChart;
}

const chartConfig = {
  booksSelling: {
    label: 'bookSellingSuccess',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;
const PieCharts = ({ books }: Props) => {
  const [chartData, setChartData] = useState<
    { bookSellingSuccess: number }[] | undefined
  >();

  const getData = () => {
    const newData = [{ ...books }];
    setChartData(newData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Transaction success</CardTitle>
        <CardDescription>Book Selling</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              fill="var(--color-booksSelling)"
              dataKey="bookSellingSuccess"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {books.bookSellingSuccess}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Book Sold
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieCharts;
