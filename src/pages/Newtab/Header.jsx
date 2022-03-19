import React from 'react';
import { SHeader } from './styles';

const Header = ({ response }) => {
  return (
    <SHeader>
      <div>{/* top sites here */}</div>
      <div>
        <h1>{response.title}</h1>
      </div>
    </SHeader>
  );
};

export default Header;
