import React from 'react';
import Helmet from 'react-helmet';

const BgColorOverride: React.FC = () => {
  return (
    // @ts-expect-error Helmet types are not properly configured
    <Helmet>
      <style>
        {`
        html, #root {
          background-color: #fff;
        }
      `}
      </style>
    </Helmet>
  );
};

export default BgColorOverride;
