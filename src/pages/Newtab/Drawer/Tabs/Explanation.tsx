import React from 'react';

const Explanation: React.FC<{ explanation?: string }> = ({ explanation }) => {
  return <div>{explanation}</div>;
};

export default Explanation;
