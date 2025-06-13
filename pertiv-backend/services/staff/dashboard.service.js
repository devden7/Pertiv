const dashboardRepository = require('../../repositories/staff/dashboard.repository');

const getDashboardData = async (start, end, filter) => {
  const { bookSellingSuccess, bookBorrowingSuccess } =
    await dashboardRepository.pieChart(start, end);

  const { transactionsBookSelling, transactionBookBorrowing } =
    await dashboardRepository.areaChart(start, end, filter);

  const { topTenBookSelling, topTenBookBorrowing } =
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
    topTenBookSelling,
    topTenBookBorrowing,
    topStaffHandlingSelling,
    topStaffHandlingLoan,
    topStaffHandlingReturn,
  };
};

module.exports = { getDashboardData };
