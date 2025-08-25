import React from 'react';
import { Helmet } from 'react-helmet';

const BgColorOverride = () => {
  return (
    // @ts-expect-error For some reason TSLint does not understand the react-helmet
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
