import React, { useEffect, useState } from 'react';
import {
  MIN_APOD_DAY,
  MIN_APOD_MONTH,
  MIN_APOD_YEAR,
} from '../../../constants';
import {
  createDate,
  months,
  daysOfWeek,
  YEARS,
  MONTHS,
  buildNumberArray,
  getToday,
} from '../../../utilities';
import { SCalendarContainer } from './styles';

type TCalendarPickerProps = {
  startDate: Date;
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
  const today = getToday();

  const [selectedMonth, setSelectedMonth] = useState<number>(
    startDate.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    startDate.getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number>(startDate.getDate());
  const [days, setDays] = useState<number[]>([]);

  const { totalDays, firstDay, prevMonthTotalDays, nextMonthTotalDays } =
    createDate(selectedYear, selectedMonth);

  const updateDays = () => {
    const newDays = buildNumberArray(totalDays);
    setDays(newDays);
  };

  const isNotValidMonth = (monthIdx: number) => {
    const invalidMinDate =
      selectedYear <= MIN_APOD_YEAR && monthIdx < MIN_APOD_MONTH;

    const invalidMaxDate =
      selectedYear >= today.getFullYear() && monthIdx > selectedMonth;
    return invalidMinDate || invalidMaxDate;
  };

  const isNotValidDay = (dayIdx: number) => {
    const invalidMinDate =
      selectedYear <= MIN_APOD_YEAR &&
      today.getMonth() <= MIN_APOD_MONTH &&
      dayIdx < MIN_APOD_DAY;

    const invalidMaxDate =
      selectedYear >= today.getFullYear() &&
      today.getMonth() >= selectedMonth &&
      dayIdx > today.getDate();
    return invalidMinDate || invalidMaxDate;
  };

  useEffect(() => {
    setSelectedYear(startDate.getFullYear());
    setSelectedMonth(startDate.getMonth());
    setSelectedDay(startDate.getDate());
    updateDays();
  }, [startDate, isOpen]);

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

  const prevMonthBtnDisabled = isNotValidMonth(selectedMonth - 1);
  const nextMonthBtnDisabled = isNotValidMonth(selectedMonth + 1);

  return (
    <SCalendarContainer>
      {children}
      {isOpen && (
        <div className="calendar">
          <div className="title">
            <button
              className="month-btn"
              disabled={prevMonthBtnDisabled}
              onClick={() => {
                changeMonth(-1);
              }}
            >
              &lt;
            </button>
            <select value={selectedMonth} name={MONTHS} onChange={changeDate}>
              {months.map((month, idx) => {
                return (
                  <option
                    key={month}
                    value={idx}
                    disabled={isNotValidMonth(idx)}
                  >
                    {month}
                  </option>
                );
              })}
            </select>
            <input
              type="number"
              value={selectedYear}
              step="1"
              name={YEARS}
              min={MIN_APOD_YEAR}
              max={today.getFullYear()}
              onChange={changeDate}
            />
            <button
              className="month-btn"
              disabled={nextMonthBtnDisabled}
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
                    disabled={isNotValidDay(day + 1)}
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
    </SCalendarContainer>
  );
};

export default CalendarPicker;
