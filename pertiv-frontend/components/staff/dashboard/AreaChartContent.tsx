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

const chartConfig = {
  bookSelling: {
    label: 'BookSelling',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface Props {
  data: IAreaChart;
  timePeriod: string;
}
const AreaChartContent = ({ data, timePeriod }: Props) => {
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
          <AreaChart data={data.transactionsBookSelling} accessibilityLayer>
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartContent;
