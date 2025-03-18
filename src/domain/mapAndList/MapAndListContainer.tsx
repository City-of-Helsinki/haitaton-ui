import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MainHeading from '../../common/components/mainHeading/MainHeading';

/** This is a container for browsing projects on a map or a list.
 * Selection for toggling the list view is currenly removed from the UI.
 */
const MapAndListContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation();

  return (
    <Flex direction="column" height="100%" marginBottom="var(--spacing-2-xl)">
      <Flex
        margin="var(--spacing-xl) var(--spacing-xl) var(--spacing-l) var(--spacing-xl)"
        justify="center"
      >
        <MainHeading className="heading-xl" weight="normal">
          {t('publicHankkeet:pageHeader')}
        </MainHeading>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default MapAndListContainer;
