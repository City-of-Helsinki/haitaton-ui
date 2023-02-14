import React from 'react';
import { Container as HdsContainer } from 'hds-react';
import { useTranslation } from 'react-i18next';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';
import { SKIP_TO_ELEMENT_ID } from '../../common/constants/constants';

const PrivacyPolicyPage: React.FC = () => {
  const { PRIVACY_POLICY } = useLocalizedRoutes();

  const { t } = useTranslation();
  return (
    <Container>
      <PageMeta routeData={PRIVACY_POLICY} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold" id={SKIP_TO_ELEMENT_ID} tabIndex={-1}>
        {t('staticPages:privacyPolicy:title')}
      </Text>

      <HdsContainer style={{ padding: '2rem', backgroundColor: 'white' }}>
        <a
          href="https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kymp/Alueiden käytön lupa- ja vuokrausasioiden asiakasrekisteri.pdf"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--color-coat-of-arms)' }}
        >
          Avaa rekisteriseloste tästä
        </a>
      </HdsContainer>
    </Container>
  );
};

export default PrivacyPolicyPage;
