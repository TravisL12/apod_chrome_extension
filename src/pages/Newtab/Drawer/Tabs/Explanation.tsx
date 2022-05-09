import React from 'react';
import { TApodResponse } from '../../../types';

const Explanation: React.FC<{ response?: TApodResponse }> = ({ response }) => {
  return (
    <>
      <h2>{response?.title}</h2>
      <div style={{ fontSize: '16px' }}>{response?.explanation}</div>
    </>
  );
};

export default Explanation;
