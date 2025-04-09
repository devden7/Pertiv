import React from 'react';
import PieCharts from './PieChart';
import {
  BookBorrowingSale,
  BookSellingSale,
  IAreaChart,
  IPieChart,
  StaffBookSellingHandle,
  staffHandlingLoan,
  staffHandlingReturn,
} from '@/model/staff.model';
import AreaChartContent from './AreaChartContent';
import TopBookSelling from './TopBookSelling';
import TopStaffHandling from './TopStaffHandling';

interface Props {
  pieChart: IPieChart;
  areaChart: IAreaChart;
  timePeriod: string;
  booksSelling: BookSellingSale[];
  dataBookBorrowed: BookBorrowingSale[];
  staffHandling: StaffBookSellingHandle[];
  loanHandling: staffHandlingLoan[];
  returnHandling: staffHandlingReturn[];
}
const ChartContent = ({
  pieChart,
  areaChart,
  timePeriod,
  booksSelling,
  dataBookBorrowed,
  staffHandling,
  loanHandling,
  returnHandling,
}: Props) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between gap-3">
      <div>
        <PieCharts books={pieChart.bookSellingSuccess} type="Book selling" />
        <TopBookSelling
          data={booksSelling}
          type="bookSelling"
          title="Top 10 Books Selling"
          description="Best seller books selling "
        />
      </div>
      <div>
        <AreaChartContent data={areaChart} timePeriod={timePeriod} />
        <TopStaffHandling
          data={staffHandling}
          title="Top 10 Staff Handled buys"
          type="Handle selling"
        />
        <TopStaffHandling
          data={loanHandling}
          title="Top 10 Staff Handled loans"
          type="Handle loan"
        />
        <TopStaffHandling
          data={returnHandling}
          title="Top 10 Staff Handled returns"
          type="Handle return"
        />
      </div>
      <div>
        <PieCharts
          books={pieChart.bookBorrowingSuccess}
          type="Book borrowing"
        />
        <TopBookSelling
          data={dataBookBorrowed}
          type="bookBorrowing"
          title="Top 10 Books Borrowing"
          description="Best seller books borrowing "
        />
      </div>
    </div>
  );
};

export default ChartContent;
