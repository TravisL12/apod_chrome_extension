import React from 'react';
import { SHistoryContainer, SHistoryItem } from '../../styles';

const History: React.FC<{
  viewHistory?: any;
  goToApodDate: (date: string) => void;
}> = ({ viewHistory, goToApodDate }) => {
  return (
    <div>
      <h1>History</h1>
      <SHistoryContainer>
        {viewHistory.map((item: any, idx: number) => {
          return (
            <SHistoryItem
              key={`${item.date}-${idx}`}
              onClick={() => {
                goToApodDate(item.date);
              }}
            >
              <div className="title">
                <p>
                  {item.title} {item.media_type !== 'image' && '(Video)'}
                </p>
              </div>
              <div className="media">
                <img
                  src={item.url}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </SHistoryItem>
          );
        })}
      </SHistoryContainer>
    </div>
  );
};

export default History;
