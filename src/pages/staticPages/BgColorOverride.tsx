import React from 'react';
import { Helmet } from 'react-helmet';

const BgColorOverride: React.FC = () => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - Known compatibility issue between react-helmet and React 18
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
