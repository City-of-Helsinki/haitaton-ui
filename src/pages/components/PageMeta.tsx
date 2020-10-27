import React from 'react';
import Helmet from 'react-helmet';
import { RouteData } from '../../common/types/route';

type Props = {
  routeData: RouteData;
};

const PageMeta: React.FC<Props> = ({ routeData }) => (
  <Helmet>
    <title>{routeData.meta.title}</title>
  </Helmet>
);

export default PageMeta;
