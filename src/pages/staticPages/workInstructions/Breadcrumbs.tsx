import { Breadcrumb, BreadcrumbListItem } from 'hds-react';
import React from 'react';

const Breadcrumbs: React.FC<React.PropsWithChildren<{ breadcrumbs: BreadcrumbListItem[] }>> = ({
  breadcrumbs,
}) => <Breadcrumb ariaLabel="Breadcrumb" list={breadcrumbs} />;

export default Breadcrumbs;
