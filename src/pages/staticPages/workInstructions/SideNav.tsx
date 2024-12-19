import React from 'react';
import { IconDocument, IconInfoCircle, SideNavigation } from 'hds-react';

const SideNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <SideNavigation
        defaultOpenMainLevels={[]}
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
          href="/fi/tyoohjeet/haittojenhallinta"
          id="main-level-3"
          label="Haittojenhallinnan lisätietokortit"
        />
        <SideNavigation.MainLevel
          external
          href="https://tapahtumat.hel.fi/"
          openInNewTab
          openInNewTabAriaLabel="Opens in a new tab."
          openInExternalDomainAriaLabel="Opens a different website."
          id="main-level-4"
          label="Tapahtumat.hel.fi"
          withDivider
        />
      </SideNavigation>
    </>
  );
};

export default SideNav;
