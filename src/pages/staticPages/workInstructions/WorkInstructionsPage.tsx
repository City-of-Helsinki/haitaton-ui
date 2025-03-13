import React, { useState } from 'react';
import PageMeta from '../../components/PageMeta';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import SideNav from './SideNav';
import styles from '../StaticContent.module.scss';
import BgColorOverride from '../BgColorOverride';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '../../../common/components/breadcrumbs/Breadcrumbs';
import { Container } from 'hds-react';

const WorkInstructionsPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { WORKINSTRUCTIONS } = useLocalizedRoutes();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  return (
    <>
      <PageMeta routeData={WORKINSTRUCTIONS} />
      <BgColorOverride />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Container alignWithHeader>
        <div className={styles.navmain}>
          <SideNav />
          <div className={styles.main}>
            <Outlet context={{ setBreadcrumbs }}></Outlet>
          </div>
        </div>
      </Container>
    </>
  );
};

export default WorkInstructionsPage;
