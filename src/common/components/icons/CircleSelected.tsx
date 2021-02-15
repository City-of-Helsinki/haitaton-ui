import React from 'react';

const Circle: React.FC = () => {
  return (
    <svg width="24px" height="25px" viewBox="0 0 24 25" version="1.1" className="circleSelected">
      <title>Selected</title>
      <g stroke="none" strokeWidth="1" fill="none">
        <g>
          <g>
            <g>
              <g>
                <circle fill="#FFFFFF" cx="12" cy="12" r="12" />
                <circle stroke="#0072CD" strokeWidth="2" cx="12" cy="12" r="11" />
                <circle fill="#0072C6" cx="12" cy="12" r="6" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
export default Circle;
