/**
 * Tranforms a date into UTC timezone
 * @param {object} Date object
 * @returns {object} Transformed date
 */
const treatAsUTC = (date) => {
  let result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
};

/**
 * @param {object, object} Start Date and End Date
 * @returns {int} Number of days
 */
const daysBetween = (startDate, endDate) => {
  let millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
};
