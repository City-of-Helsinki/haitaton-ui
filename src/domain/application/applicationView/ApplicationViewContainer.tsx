import React from 'react';
import { AxiosError } from 'axios';
import { LoadingSpinner } from 'hds-react';
import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import ApplicationView from './ApplicationView';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import useHanke from '../../hanke/hooks/useHanke';
import { useApplication } from '../hooks/useApplication';

type Props = {
  id: number;
};

function ApplicationViewContainer({ id }: Props) {
  const { t } = useTranslation();
  const { data: application, isLoading, isError, error } = useApplication(id);
  const { data: hanke } = useHanke(application?.hankeTunnus);

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if ((isError && (error as AxiosError).response?.status === 404) || Number.isNaN(id)) {
    return <ErrorLoadingText>{t('hakemus:errors:notFound')}</ErrorLoadingText>;
  }

  if (isError) {
    return <ErrorLoadingText />;
  }

  if (!application) {
    return null;
  }

  return <ApplicationView application={application} hanke={hanke} />;
}

export default ApplicationViewContainer;
