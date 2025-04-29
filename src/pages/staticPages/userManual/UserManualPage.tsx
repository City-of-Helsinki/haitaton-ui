import React, { useState } from 'react';
import PageMeta from '../../components/PageMeta';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import styles from '../StaticContent.module.scss';
import BgColorOverride from '../BgColorOverride';
import { Outlet } from 'react-router-dom';
import { Container } from 'hds-react';
import Breadcrumbs from '../../../common/components/breadcrumbs/Breadcrumbs';
import SideNav from './SideNav';

const UserManualPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { MANUAL } = useLocalizedRoutes();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  return (
    <>
      <PageMeta routeData={MANUAL} />
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

export default UserManualPage;
