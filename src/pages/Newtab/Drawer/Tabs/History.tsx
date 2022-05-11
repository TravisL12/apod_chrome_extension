import React from 'react';
import { THistoryItem } from '../../../types';
import { SGridImageContainer } from '../../styles';
import GridImage from './GridImage';
import GridHeader, { useSearch } from './GridHeader';

const History: React.FC<{
  viewHistory?: THistoryItem[];
  goToApodDate: (date: string) => void;
}> = ({ viewHistory, goToApodDate }) => {
  const { keyword, setKeyword, filteredItems } = useSearch(viewHistory);
  return (
    <>
      <GridHeader title={'History'} keyword={keyword} onChange={setKeyword} />
      <SGridImageContainer>
        {filteredItems?.map((item: any, idx: number) => {
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
