import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import FullPageMap from '../domain/map/components/FullPageMap/FullPageMap';

const FullPageMapPage: React.FC = () => {
  const { hankeTunnus } = useParams();
  const { FULL_PAGE_MAP } = useLocalizedRoutes();

  return (
    <>
      <PageMeta routeData={FULL_PAGE_MAP} />
      <FullPageMap hankeTunnus={hankeTunnus} />
    </>
  );
};

export default FullPageMapPage;
