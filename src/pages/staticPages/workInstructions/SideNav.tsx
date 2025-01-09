import React from 'react';
import { IconDocument, IconInfoCircle, SideNavigation } from 'hds-react';
import styles from './WorkInstructions.module.scss';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SideNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className={styles.sidenavcontainer}>
      <SideNavigation
        defaultOpenMainLevels={[1]}
        id="side-navigation"
        toggleButtonLabel={t('workInstructions:sideNav:moveToPage')}
      >
        <SideNavigation.MainLevel
          icon={<IconInfoCircle />}
          href="/fi/tyoohjeet"
          id="#main-level-1"
          label={t('workInstructions:main:header')}
          active={location.pathname.endsWith(t('routes:WORKINSTRUCTIONS:path'))}
        ></SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          icon={<IconDocument />}
          href="/fi/tyoohjeet/haittojenhallinta"
          id="#main-level-1"
          label={t('workInstructions:cardsIndex:header')}
          active={location.pathname.endsWith(t('routes:CARDS_INDEX:path'))}
        ></SideNavigation.MainLevel>

        <SideNavigation.MainLevel
          index={1}
          id="main-level-3"
          label={`1. ${t('workInstructions:cards:1:header')}`}
        >
          <SideNavigation.SubLevel
            href="/fi/tyoohjeet/haittojenhallinta/1/perustaso"
            id="sub-level-5"
            label={t('workInstructions:cards:basicLevel')}
            mainLevelIndex={1}
            active={location.pathname.endsWith('haittojenhallinta/1/perustaso')}
          ></SideNavigation.SubLevel>
          <SideNavigation.SubLevel
            href="/fi/tyoohjeet/haittojenhallinta/1/lisataso"
            id="sub-level-3"
            label={t('workInstructions:cards:additionalLevel')}
            active={location.pathname.endsWith('haittojenhallinta/1/lisataso')}
          />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
          openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
          id="main-level-4"
          label="Työmaan luvat ja ohjeet"
          withDivider
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
          openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
          id="main-level-4"
          label="Maksut"
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel={t('workInstructions:sideNav:openInNewTab')}
          openInExternalDomainAriaLabel={t('workInstructions:sideNav:openInExternalDomain')}
          id="main-level-4"
          label="Tilapäisten liikennejärjestelyiden ohje ja tyyppikuvat"
        />
      </SideNavigation>
    </div>
  );
};

export default SideNav;
