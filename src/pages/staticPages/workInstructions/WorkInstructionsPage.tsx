import React, { useState } from 'react';
import PageMeta from '../../components/PageMeta';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import SideNav from './SideNav';
import styles from './WorkInstructions.module.scss';
import BgColorOverride from './BgColorOverride';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const WorkInstructionsPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { WORKINSTRUCTIONS } = useLocalizedRoutes();
  const [breadcrumbs] = useState([{ title: 'Työhjeet', path: '/' }]);

  return (
    <>
      <PageMeta routeData={WORKINSTRUCTIONS} />
      <BgColorOverride />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.container}>
        <div className={styles.navmain}>
          <SideNav />
          <main>
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  );
};

export default WorkInstructionsPage;
