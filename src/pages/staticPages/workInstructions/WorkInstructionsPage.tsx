import React, { useState } from 'react';
import PageMeta from '../../components/PageMeta';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import SideNav from './SideNav';
import styles from './WorkInstructions.module.scss';
import BgColorOverride from './BgColorOverride';
import { Outlet, useOutletContext } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { BreadcrumbListItem, Container } from 'hds-react';

type ContextType = {
  breadcrumbs: BreadcrumbListItem[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbListItem[]>>;
};

// use in child routes to set breadcrumbs
export function useBreadcrumbs() {
  return useOutletContext<ContextType>();
}

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
