import styled from 'styled-components';

export const SCalendarContainer = styled.div`
  --day-size: 40px;
  --day-color: lightblue;
  --day-hover-color: rgba(0, 0, 0, 0.3);
  --day-checked-color: #80cbc4;
  --calendar-color: rgb(63 68 88);

  position: relative;

  .calendar {
    position: absolute;
    top: 100%;
    right: 50%;
    z-index: 1;
    padding: 0 10px 10px;
    background: var(--calendar-color);
    color: white;
    border-radius: 4px;
  }

  .title {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
  }

  .title select,
  .title input,
  .month-btn {
    background: var(--calendar-color);
    border: none;
    color: inherit;
    font-size: 20px;
  }

  .title input {
    width: 75px;
  }

  .dow-container {
    display: flex;
    gap: 3px;
    margin-bottom: 5px;
  }
  .dow-container .dow {
    width: var(--day-size);
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, var(--day-size));
    grid-auto-rows: var(--day-size);
    grid-gap: 3px;
  }
  .day {
    position: relative;
    transition: 0.05s linear background;
    margin: 4px;
  }
  .day.prev {
    color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .day.prev:hover {
    background: none;
  }
  .day:hover {
    background: var(--day-hover-color);
  }

  .day input {
    opacity: 0;
    position: absolute;
  }

  .day label {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: inherit;
  }
  .day input:checked + label {
    background: var(--day-checked-color);
  }
`;
