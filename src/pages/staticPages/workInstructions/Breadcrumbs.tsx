import { Breadcrumb } from 'hds-react';
import React from 'react';

const Breadcrumbs = () => (
  <Breadcrumb
    ariaLabel="Breadcrumb"
    list={[
      { title: 'Front page', path: '/' },
      { title: 'Health and social services', path: '/path' },
      { title: 'Senior services', path: '/path/2ndLevelPath' },
      { title: 'Informal care', path: '/path/2ndLevelPath/3rdLevelPath' },
      { title: 'Care options', path: null },
    ]}
  />
);

export default Breadcrumbs;
