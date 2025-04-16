import React from 'react';
import { Container as HdsContainer, CookieSettingsPage } from 'hds-react';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import Container from '../common/components/container/Container';

const CookieConsentPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { COOKIE_CONSENT } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={COOKIE_CONSENT} />

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <CookieSettingsPage />
      </HdsContainer>
    </Container>
  );
};

export default CookieConsentPage;
