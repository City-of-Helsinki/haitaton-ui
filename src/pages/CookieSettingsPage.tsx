import React from 'react';
import { Container as HdsContainer, CookieSettingsPage as HdsCookieSettingsPage } from 'hds-react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import Container from '../common/components/container/Container';

const CookieSettingsPage: React.FC<React.PropsWithChildren> = () => {
  const { COOKIE_CONSENT } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={COOKIE_CONSENT} />
      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <HdsCookieSettingsPage />
      </HdsContainer>
    </Container>
  );
};

export default CookieSettingsPage;
