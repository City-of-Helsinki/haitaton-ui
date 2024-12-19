import React from 'react';
import { Helmet } from 'react-helmet';

const BgColorOverride = () => {
  return (
    <Helmet>
      <style>
        {`
        #root {
          background-color: white;
        }
      `}
      </style>
    </Helmet>
  );
};

export default BgColorOverride;
