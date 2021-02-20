import React from 'react';

const createDate = (year, month) => {
  const date = new Date(year, month, 0); // 0-index month (0 - 11)
  const firstDay = new Date(year, month).getDay(); // 0-index day of week (0 - 6)
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prettyName = date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
  });

  return {
    firstDay,
    totalDays,
    prettyName,
  };
};

// set date format to YYYY-M-D (leading 0's create UTC format)
const formattedStartDate = (startDate) =>
  new Date(startDate.replace(/\-0/gi, '-'));

const DatePicker = ({ selectedMonth, selectedYear, selectedDay }) => {
  let yearsSelect = [];
  for (let i = TODAY.getFullYear() - 50; i < TODAY.getFullYear() + 10; i++) {
    yearsSelect.push(<option value={i}>{i}</option>);
  }

  return (
    <div>
      <form className="title">
        <select name="months" value={selectedMonth}>
          {months.map((month, idx) => {
            return <option value={idx}>{month}</option>;
          })}
        </select>
        <select name="years" value={selectedYear}>
          {yearsSelect}
        </select>
      </form>
      <div className="dow-container"></div>
      <div className="grid"></div>
    </div>
  );
};

export default DatePicker;
