import React, { useEffect, useMemo, useState } from 'react';
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
  minDate?: string | Date;
  maxDate?: string | Date;
  setIsOpen: (value: boolean) => void;
  onChange: (value: string) => void;
};

const CalendarPicker: React.FC<TCalendarPickerProps> = ({
  startDate,
  isOpen,
  minDate,
  maxDate,
  children,
  onChange,
  setIsOpen,
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

  const minimumDate = useMemo(() => {
    if (!minDate) {
      return null;
    }
    const date = minDate instanceof Date ? minDate : new Date(minDate);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  }, [minDate]);

  const maximumDate = useMemo(() => {
    if (!maxDate) {
      return null;
    }
    const date = maxDate instanceof Date ? maxDate : new Date(maxDate);

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  }, [maxDate]);

  const { totalDays, firstDay, prevMonthTotalDays, nextMonthTotalDays } =
    createDate(selectedYear, selectedMonth);

  const updateDays = () => {
    const newDays = buildNumberArray(totalDays);
    setDays(newDays);
  };

  const isNotValidMonth = (monthIdx: number) => {
    const invalidMinDate = minimumDate
      ? selectedYear <= minimumDate.year && monthIdx < minimumDate.month
      : false;

    const invalidMaxDate = maximumDate
      ? selectedYear >= maximumDate.year && monthIdx > selectedMonth
      : false;

    return invalidMinDate || invalidMaxDate;
  };

  const isNotValidDay = (dayIdx: number) => {
    const invalidMinMonth =
      minimumDate &&
      selectedYear <= minimumDate.year &&
      selectedMonth < minimumDate.month;

    const invalideMinDay =
      minimumDate &&
      selectedYear <= minimumDate.year &&
      selectedMonth <= minimumDate.month &&
      dayIdx < minimumDate.day;

    const invalidMinDate = minimumDate
      ? invalidMinMonth || invalideMinDay
      : false;

    const invalidMaxDate = maximumDate
      ? selectedYear >= maximumDate.year &&
        selectedMonth >= maximumDate.month &&
        dayIdx > maximumDate.day
      : false;
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
              min={minimumDate?.year}
              max={maximumDate?.year}
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
