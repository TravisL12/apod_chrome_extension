import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const FADE_DELAY = 1000;

const SFaderContainer = styled.div`
  .fader {
    transition: opacity ${FADE_DELAY}ms ease;
  }

  .fade-in {
    opacity: 1;
  }

  .fade-out {
    opacity: 0;
  }
`;

const Fader: React.FC<{ isVisible: boolean }> = ({ isVisible, children }) => {
  // start in closed state, let useEffect trigger
  const [isOpen, setIsOpen] = useState(false);
  const [fade, setFade] = useState('fade-out');

  useEffect(() => {
    if (!isVisible) {
      setFade('fade-out');

      const timeout = setTimeout(() => {
        setIsOpen(isVisible); // isVisible => false (closed)
      }, FADE_DELAY * 2);

      return () => clearTimeout(timeout);
    }

    setFade('fade-in');
    setIsOpen(isVisible); // isVisible => true (open)
  }, [isVisible]);

  return (
    <>
      {isOpen && (
        <SFaderContainer>
          <div className={`fader ${fade}`}>{children}</div>
        </SFaderContainer>
      )}
    </>
  );
};

export default Fader;
