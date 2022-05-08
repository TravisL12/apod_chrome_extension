import React from 'react';
import { THistoryItem } from '../../../types';
import { SGridImageContainer } from '../../styles';
import GridImage from './GridImage';

const History: React.FC<{
  viewHistory?: THistoryItem[];
  goToApodDate: (date: string) => void;
}> = ({ viewHistory, goToApodDate }) => {
  return (
    <>
      <h1>History</h1>
      <SGridImageContainer>
        {viewHistory?.map((item: any, idx: number) => {
          return (
            <GridImage
              key={`${item.date}-${idx}`}
              goToDate={goToApodDate}
              item={item}
            />
          );
        })}
      </SGridImageContainer>
    </>
  );
};

export default History;
