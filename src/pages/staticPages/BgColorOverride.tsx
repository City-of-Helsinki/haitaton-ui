import React from 'react';
import { Helmet } from 'react-helmet';

const BgColorOverride = () => {
  return (
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
