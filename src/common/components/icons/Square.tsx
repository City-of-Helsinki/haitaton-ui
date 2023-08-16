import React from 'react';

const Square: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Square</title>
      <path d="M3 21V3h18v18H3Z" stroke="#000" strokeWidth="1.75" />
    </svg>
  );
};
export default Square;
