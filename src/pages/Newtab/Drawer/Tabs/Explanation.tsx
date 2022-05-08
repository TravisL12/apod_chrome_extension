import React from 'react';
import { TApodResponse } from '../../../types';

const Explanation: React.FC<{ response?: TApodResponse }> = ({ response }) => {
  return (
    <>
      <h3>{response?.title}</h3>
      <div>{response?.explanation}</div>;
    </>
  );
};

export default Explanation;
