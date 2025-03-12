import React, { useEffect, useState } from 'react';
import { IconInfoCircle, SideNavigation } from 'hds-react';
import styles from '../StaticContent.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';

const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { MANUAL } = useLocalizedRoutes();
  const { number = '', type = '' } = useParams<{ number: string; type: string }>();

  useEffect(() => {
    setActive(window.location.pathname);
  }, [number, type]);

  const setActivePage = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    path: string,
  ) => {
    event.preventDefault();
    setActive(path);
    navigate(path);
  };

  return (
    <div className={styles.sidenavcontainer}>
      <SideNavigation
        defaultOpenMainLevels={[1]}
        id="side-navigation"
        toggleButtonLabel={t('common:components:moveToPage')}
      >
        <SideNavigation.MainLevel
          icon={<IconInfoCircle />}
          href={MANUAL.path}
          id="#main"
          label={t('staticPages:manualPage:main:heading')}
          onClick={(e) => setActivePage(e, MANUAL.path)}
          active={active === MANUAL.path}
        />
        ,
      </SideNavigation>
    </div>
  );
};

export default SideNav;
