import React from 'react';
import Helmet from 'react-helmet';
import { RouteData } from '../../common/types/route';

type Props = {
  routeData: RouteData;
};

const PageMeta: React.FC<React.PropsWithChildren<Props>> = ({ routeData }) => {
  return (
    // @ts-expect-error Helmet types are not properly configured
    <Helmet>
      <title>{routeData.meta.title}</title>
    </Helmet>
  );
};

export default PageMeta;
