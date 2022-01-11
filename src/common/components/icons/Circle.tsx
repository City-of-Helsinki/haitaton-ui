import React from 'react';

type Props = {
  active?: boolean;
};

const Circle: React.FC<Props> = ({ active }) => {
  return (
    <svg width="24px" height="25px" viewBox="0 0 24 25" version="1.1" className="circle">
      <g stroke="none" strokeWidth="0" fill="none" fillRule="evenodd">
        <g>
          <g>
            <g>
              <g>
                <circle fill="#FFFFFF" cx="12" cy="12" r="12" />
                <circle
                  stroke={active ? '#0072C6' : '#808080'}
                  strokeWidth="2"
                  cx="12"
                  cy="12"
                  r="11"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
export default Circle;
