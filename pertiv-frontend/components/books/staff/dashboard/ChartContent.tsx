import React from 'react';
import PieCharts from './PieChart';
import { IAreaChart, IPieChart } from '@/model/staff.model';
import AreaChartContent from './AreaChartContent';

interface Props {
  pieChart: IPieChart;
  areaChart: IAreaChart;
  timePeriod: string;
}
const ChartContent = ({ pieChart, areaChart, timePeriod }: Props) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-3">
      <div className="max-w-full max-sm:mx-auto">
        <PieCharts books={pieChart} />
      </div>
      <div className="max-w-full">
        <AreaChartContent data={areaChart} timePeriod={timePeriod} />
      </div>
    </div>
  );
};

export default ChartContent;
