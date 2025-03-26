import React from 'react';
import PieCharts from './PieChart';
import {
  BookSellingSale,
  IAreaChart,
  IPieChart,
  StaffBookSellingHandle,
} from '@/model/staff.model';
import AreaChartContent from './AreaChartContent';
import TopBookSelling from './TopBookSelling';
import TopStaffHandling from './TopStaffHandling';

interface Props {
  pieChart: IPieChart;
  areaChart: IAreaChart;
  timePeriod: string;
  booksSelling: BookSellingSale[];
  staffHandling: StaffBookSellingHandle[];
}
const ChartContent = ({
  pieChart,
  areaChart,
  timePeriod,
  booksSelling,
  staffHandling,
}: Props) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-3">
      <div>
        <PieCharts books={pieChart} />
        <TopBookSelling data={booksSelling} />
      </div>
      <div>
        <AreaChartContent data={areaChart} timePeriod={timePeriod} />
        <TopStaffHandling data={staffHandling} />
      </div>
    </div>
  );
};

export default ChartContent;
