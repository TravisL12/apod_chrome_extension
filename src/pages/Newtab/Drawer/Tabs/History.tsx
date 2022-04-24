import React from 'react';

const History: React.FC<{ viewHistory?: any }> = ({ viewHistory }) => {
  console.log(viewHistory, 'viewHistory');

  return (
    <div>
      <h1>History</h1>
      <div>
        {viewHistory.reverse().map((item: any) => {
          return <div key={item.date}>{item.date}</div>;
        })}
      </div>
    </div>
  );
};

export default History;
