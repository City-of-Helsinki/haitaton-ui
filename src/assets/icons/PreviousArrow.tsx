import React from 'react';

const PreviousArrow: React.FC = (props) => {
  return (
    <svg viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <rect width="24" height="24" />
        <polygon
          fill="currentColor"
          points="10 5.5 11.5 7 7.5 11 20 11 20 13 7.5 13 11.5 17 10 18.5 3.5 12"
        />
      </g>
    </svg>
  );
};
export default PreviousArrow;
