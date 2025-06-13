const dashboardRepository = require('../../repositories/staff/dashboard.repository');

const getDashboardData = async (start, end, filter) => {
  const { bookSellingSuccess, bookBorrowingSuccess } =
    await dashboardRepository.pieChart(start, end);

  const { transactionsBookSelling, transactionBookBorrowing } =
    await dashboardRepository.areaChart(start, end, filter);

  const { topBookSelling, topBookBorrowing } =
    await dashboardRepository.topTenBook(start, end);

  const {
    topStaffHandlingSelling,
    topStaffHandlingLoan,
    topStaffHandlingReturn,
  } = await dashboardRepository.topTenStaff(start, end);
  return {
    bookSellingSuccess,
    bookBorrowingSuccess,
    transactionsBookSelling,
    transactionBookBorrowing,
    topBookSelling,
    topBookBorrowing,
    topStaffHandlingSelling,
    topStaffHandlingLoan,
    topStaffHandlingReturn,
  };
};

module.exports = { getDashboardData };
