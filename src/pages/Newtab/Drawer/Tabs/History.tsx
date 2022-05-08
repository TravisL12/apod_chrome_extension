import React from 'react';
import { SHistoryContainer } from '../../styles';
import GridImage from './GridImage';

const History: React.FC<{
  viewHistory?: any;
  goToApodDate: (date: string) => void;
}> = ({ viewHistory, goToApodDate }) => {
  return (
    <>
      <h1>History</h1>
      <SHistoryContainer>
        {viewHistory.map((item: any, idx: number) => {
          return (
            <GridImage
              key={`${item.date}-${idx}`}
              goToDate={goToApodDate}
              item={item}
            />
          );
        })}
      </SHistoryContainer>
    </>
  );
};

export default History;
