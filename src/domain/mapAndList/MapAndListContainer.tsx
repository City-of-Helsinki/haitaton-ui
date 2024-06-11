import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Outlet, NavLink } from 'react-router-dom';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import MainHeading from '../../common/components/mainHeading/MainHeading';

const MapAndListContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { PUBLIC_HANKKEET_LIST, PUBLIC_HANKKEET_MAP } = useLocalizedRoutes();
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
      <Flex justify="center" align="center" margin="var(--spacing-m)">
        <div>
          <NavLink to={PUBLIC_HANKKEET_MAP.path}>
            {({ isActive }) => (
              <div
                className={
                  'hds-button hds-button--theme-black ' +
                  (isActive ? 'hds-button--primary' : 'hds-button--secondary')
                }
              >
                <span className="hds-button__label">{t('publicHankkeet:buttons:map')}</span>
                <span className="hds-icon hds-icon--map hds-icon--size-s" aria-hidden="true"></span>
              </div>
            )}
          </NavLink>
          <NavLink to={PUBLIC_HANKKEET_LIST.path}>
            {({ isActive }) => (
              <div
                className={
                  'hds-button hds-button--theme-black ' +
                  (isActive ? 'hds-button--primary' : 'hds-button--secondary')
                }
              >
                <span className="hds-button__label">{t('publicHankkeet:buttons:list')}</span>
                <span
                  className="hds-icon hds-icon--layers hds-icon--size-s"
                  aria-hidden="true"
                ></span>
              </div>
            )}
          </NavLink>
        </div>
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default MapAndListContainer;
