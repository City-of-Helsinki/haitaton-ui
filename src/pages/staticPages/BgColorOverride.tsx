import React from 'react';
import { Helmet } from 'react-helmet';

const BgColorOverride: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HelmetComponent = Helmet as any;

  return (
    <HelmetComponent>
      <style>
        {`
        html, #root {
          background-color: #fff;
        }
      `}
      </style>
    </HelmetComponent>
  );
};

export default BgColorOverride;
