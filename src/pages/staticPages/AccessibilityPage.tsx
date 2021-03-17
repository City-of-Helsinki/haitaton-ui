import React from 'react';
import PageMeta from '../components/PageMeta';
import { useLocalizedRoutes } from '../../common/hooks/useLocalizedRoutes';
import Container from '../../common/components/container/Container';
import Text from '../../common/components/text/Text';

const AccessibilityPage: React.FC = () => {
  const { HAITATON_INFO } = useLocalizedRoutes();

  return (
    <Container>
      <PageMeta routeData={HAITATON_INFO} />
      <Text tag="h1" styleAs="h2" spacing="s" weight="bold">
        Accessibility
      </Text>
    </Container>
  );
};

export default AccessibilityPage;
