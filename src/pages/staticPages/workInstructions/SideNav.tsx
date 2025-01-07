import React from 'react';
import { IconDocument, IconInfoCircle, SideNavigation } from 'hds-react';

const SideNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <SideNavigation
        defaultOpenMainLevels={[1, 2]}
        id="side-navigation"
        toggleButtonLabel="Navigate to page"
      >
        <SideNavigation.MainLevel
          icon={<IconInfoCircle />}
          href="/fi/tyoohjeet"
          id="#main-level-1"
          label="Työohjeet"
        ></SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          icon={<IconDocument />}
          href="/fi/tyoohjeet"
          id="#main-level-1"
          label="Haittojenhallinnan lisätietokortit"
        ></SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          index={1}
          href="/fi/tyoohjeet/haittojenhallinta"
          id="main-level-3"
          label="1. Tiedotus eri osapuolille ja palaute"
        >
          <SideNavigation.SubLevel
            href="/fi/tyoohjeet/haittojenhallinta/1/perustaso"
            id="sub-level-5"
            label="Vaadittava perustaso"
            mainLevelIndex={1}
          ></SideNavigation.SubLevel>
          <SideNavigation.SubLevel href="/map" id="sub-level-3" label="Mahdollinen lisätaso" />
        </SideNavigation.MainLevel>
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Opens a different website."
          id="main-level-4"
          label="Työmaan luvat ja ohjeet"
          withDivider
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Opens a different website."
          id="main-level-4"
          label="Maksut"
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Opens a different website."
          id="main-level-4"
          label="Tilapäisten liikennejärjestelyiden ohje ja tyyppikuvat"
        />
      </SideNavigation>
    </>
  );
};

export default SideNav;
