import React from 'react';
import { IconDocument, IconInfoCircle, SideNavigation } from 'hds-react';
import styles from './WorkInstructions.module.scss';
import { useLocation } from 'react-router-dom';

const SideNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  const location = useLocation();

  return (
    <div className={styles.sidenavcontainer}>
      <SideNavigation
        defaultOpenMainLevels={[1, 2]}
        id="side-navigation"
        toggleButtonLabel="Siirry sivulle"
      >
        <SideNavigation.MainLevel
          icon={<IconInfoCircle />}
          href="/fi/tyoohjeet"
          id="#main-level-1"
          label="Työohjeet"
          active={location.pathname.endsWith('tyoohjeet')}
        ></SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          icon={<IconDocument />}
          href="/fi/tyoohjeet/haittojenhallinta"
          id="#main-level-1"
          label="Haittojenhallinnan lisätietokortit"
          active={location.pathname.endsWith('haittojenhallinta')}
        ></SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          index={1}
          id="main-level-3"
          label="1. Tiedotus eri osapuolille ja palaute"
        >
          <SideNavigation.SubLevel
            href="/fi/tyoohjeet/haittojenhallinta/1/perustaso"
            id="sub-level-5"
            label="Vaadittava perustaso"
            mainLevelIndex={1}
            active={location.pathname.endsWith('haittojenhallinta/1/perustaso')}
          ></SideNavigation.SubLevel>
          <SideNavigation.SubLevel
            href="/fi/tyoohjeet/haittojenhallinta/1/lisataso"
            id="sub-level-3"
            label="Mahdollinen lisätaso"
            active={location.pathname.endsWith('haittojenhallinta/1/lisataso')}
          />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Avautuu eri verkkosivulla."
          id="main-level-4"
          label="Työmaan luvat ja ohjeet"
          withDivider
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Avautuu eri verkkosivulla."
          id="main-level-4"
          label="Maksut"
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Avautuu eri verkkosivulla."
          id="main-level-4"
          label="Tilapäisten liikennejärjestelyiden ohje ja tyyppikuvat"
        />
      </SideNavigation>
    </div>
  );
};

export default SideNav;
