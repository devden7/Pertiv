const {
  format,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfMinute,
} = require('date-fns');

const groupAnalyticsChart = (date, period) => {
  switch (period) {
    case 'last_hour':
      const start = startOfMinute(date);
      return format(start, 'HH:mm');

    case 'today':
      const roundedHourToday = setMinutes(
        setSeconds(setMilliseconds(date, 0), 0),
        0
      );
      return format(roundedHourToday, 'HH:mm');

    case 'yesterday':
      const roundedHourYesterday = setMinutes(
        setSeconds(setMilliseconds(date, 0), 0),
        0
      );

      return format(roundedHourYesterday, 'dd MMM • HH:mm');
    case 'last_7_days':
      const isDay_7 = startOfDay(date);
      return format(isDay_7, 'MMM d');

    case 'last_30_days':
      const isToday_30 = startOfDay(date);
      return format(isToday_30, 'MMM d');

    default:
      const roundedHour = setMinutes(
        setSeconds(setMilliseconds(date, 0), 0),
        0
      );
      return format(roundedHour, 'HH:mm');
  }
};

module.exports = { groupAnalyticsChart };
