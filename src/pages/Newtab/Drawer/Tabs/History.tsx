import React from 'react';

const History: React.FC<{
  viewHistory?: any;
  goToApodDate: (date: string) => void;
}> = ({ viewHistory, goToApodDate }) => {
  return (
    <div>
      <h1>History</h1>
      <div>
        {viewHistory.reverse().map((item: any) => {
          return (
            <div
              key={item.date}
              style={{
                background: 'gray',
                padding: '10px',
                marginBottom: '10px',
              }}
              onClick={() => {
                goToApodDate(item.date);
              }}
            >
              <div>{item.title}</div>
              {item.media_type === 'image' ? (
                <div style={{ width: '100%', height: '200px' }}>
                  <img
                    src={item.url}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
              ) : (
                <div>Video</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
