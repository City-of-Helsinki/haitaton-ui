import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import Container from '../common/components/container/Container';
import PageMeta from './components/PageMeta';
import { useLocalizedRoutes } from '../common/hooks/useLocalizedRoutes';
import { useHankeDataInApplication } from '../domain/application/hooks/useHankeDataInApplication';
import KaivuilmoitusContainer from '../domain/kaivuilmoitus/KaivuilmoitusContainer';
import ErrorLoadingText from '../common/components/errorLoadingText/ErrorLoadingText';
import { useTranslation } from 'react-i18next';

const NewKaivuilmoitusPage = () => {
  const { KAIVUILMOITUSHAKEMUS } = useLocalizedRoutes();
  const result = useHankeDataInApplication();
  const { t } = useTranslation();

  if (result?.isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner
          loadingText={t('common:components:loadingSpinner:loadingText')}
          loadingFinishedText={t('common:components:loadingSpinner:loadingFinishedText')}
        />
      </Flex>
    );
  }

  if (result?.error) {
    return <ErrorLoadingText />;
  }

  if (!result?.data) {
    return null;
  }

  return (
    <Container>
      <PageMeta routeData={KAIVUILMOITUSHAKEMUS} />
      <KaivuilmoitusContainer hankeData={result.data} />
    </Container>
  );
};

export default NewKaivuilmoitusPage;
