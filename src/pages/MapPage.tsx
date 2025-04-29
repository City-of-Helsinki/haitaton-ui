import React from 'react';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import PageMeta from './components/PageMeta';
import HankeMapContainer from '../domain/map/HankeMap';
import MainHeading from '../common/components/mainHeading/MainHeading';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const MapPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { PUBLIC_HANKKEET } = useLocalizedRoutes();
  const { t } = useTranslation();

  return (
    <>
      <PageMeta routeData={PUBLIC_HANKKEET} />
      <Flex direction="column" height="100%" marginBottom="var(--spacing-2-xl)">
        <Flex
          margin="var(--spacing-xl) var(--spacing-xl) var(--spacing-l) var(--spacing-xl)"
          justify="center"
        >
          <MainHeading className="heading-xl" weight="normal">
            {t('publicHankkeet:pageHeader')}
          </MainHeading>
        </Flex>
        <PageMeta routeData={PUBLIC_HANKKEET} />
        <HankeMapContainer />
      </Flex>
    </>
  );
};

export default MapPage;
