import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDate,
  months,
  daysOfWeek,
  YEARS,
  MONTHS,
  buildNumberArray,
} from './calendarHelpers';
import './index.css';

type TCalendarPickerProps = {
  startDate?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onChange: (value: string) => void;
};

const CalendarPicker: React.FC<TCalendarPickerProps> = ({
  startDate,
  onChange,
  isOpen,
  setIsOpen,
  children,
}) => {
  const dateProp = useMemo(() => {
    if (!startDate) {
      return new Date();
    }
    if (typeof startDate === 'string') {
      return new Date(startDate);
    }
    return startDate;
  }, [startDate]);

  const [selectedMonth, setSelectedMonth] = useState<number>(
    dateProp.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    dateProp.getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number>(dateProp.getDate());
  const [days, setDays] = useState<number[]>([]);

  const { totalDays, firstDay, prevMonthTotalDays, nextMonthTotalDays } =
    createDate(selectedYear, selectedMonth);

  const updateDays = () => {
    const newDays = buildNumberArray(totalDays);
    setDays(newDays);
  };

  useEffect(() => {
    setSelectedYear(dateProp.getFullYear());
    setSelectedMonth(dateProp.getMonth());
    setSelectedDay(dateProp.getDate());
    updateDays();
  }, [dateProp, isOpen]);

  const changeMonth = (change: any) => {
    const isJanuary = selectedMonth === 0;
    const isDecember = selectedMonth === months.length - 1;

    if (isJanuary && change < 0) {
      setSelectedYear(selectedYear - 1);
      setSelectedMonth(months.length - 1);
    } else if (isDecember && change > 0) {
      setSelectedYear(selectedYear + 1);
      setSelectedMonth((selectedMonth + change) % months.length);
    } else {
      setSelectedMonth((selectedMonth + change) % months.length);
    }
  };

  const changeDate = (event: any) => {
    const { name, value } = event.target;
    if (name === 'months') {
      setSelectedMonth(+value);
    }
    if (name === 'years') {
      setSelectedYear(value);
    }
    updateDays();
  };

  const daysBefore = buildNumberArray(prevMonthTotalDays).slice(
    prevMonthTotalDays - firstDay
  );

  const endDow = totalDays + firstDay;
  const daysAfter = endDow <= 35 ? 35 - endDow : 42 - endDow;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="calendar-container">
      {children}
      {isOpen && (
        <div className="calendar">
          <div className="title">
            <button
              className="month-btn"
              onClick={() => {
                changeMonth(-1);
              }}
            >
              &lt;
            </button>
            <select value={selectedMonth} name={MONTHS} onChange={changeDate}>
              {months.map((month, idx) => (
                <option key={month} value={idx}>
                  {month}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              step="1"
              name={YEARS}
              onChange={changeDate}
            />
            <button
              className="month-btn"
              onClick={() => {
                changeMonth(1);
              }}
            >
              &gt;
            </button>
          </div>
          <div className="dow-container">
            {daysOfWeek.map((dow) => (
              <div key={dow} className="dow">
                {dow}
              </div>
            ))}
          </div>
          <div className="grid">
            {daysBefore.map((day) => (
              <div key={day} className="day prev">
                {day + 1}
              </div>
            ))}
            {days.map((day) => {
              const style = day === 0 ? { gridColumnStart: firstDay + 1 } : {};
              return (
                <form key={`id-${day}`} style={style} className="day">
                  <input
                    onChange={() => {
                      setSelectedDay(day + 1);
                      onChange(
                        `${+selectedYear}-${+selectedMonth + 1}-${+day + 1}`
                      );
                      setIsOpen(false);
                    }}
                    checked={selectedDay - 1 === day}
                    id={`id-${day}`}
                    type="radio"
                    name="dates"
                  />
                  <label htmlFor={`id-${day}`}>{day + 1}</label>
                </form>
              );
            })}
            {buildNumberArray(nextMonthTotalDays)
              .slice(0, daysAfter)
              .map((day) => (
                <div key={day} className="day prev">
                  {day + 1}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
