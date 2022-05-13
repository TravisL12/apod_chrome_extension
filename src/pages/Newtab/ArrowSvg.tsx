import React from 'react';
import { SArrowContainer, lightGray } from './styles';

export const ArrowSvg: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  size: number;
  pointRight?: boolean;
}> = ({ onClick, size = 15, pointRight, disabled }) => {
  return (
    <SArrowContainer
      onClick={() => {
        if (!disabled) onClick();
      }}
      size={size}
      pointRight={pointRight}
    >
      <svg width={size} height={size * 2}>
        <path
          fill={lightGray}
          d={`M0,${size} L${size},${size * 2} L${size},0z`}
        />
      </svg>
    </SArrowContainer>
  );
};
