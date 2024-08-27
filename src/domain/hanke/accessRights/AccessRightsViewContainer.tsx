import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import { useHankeUsers } from '../hankeUsers/hooks/useHankeUsers';
import useHanke from '../hooks/useHanke';
import AccessRightsView from './AccessRightsView';
import { usePermissionsForHanke } from '../hankeUsers/hooks/useUserRightsForHanke';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';

type Props = {
  hankeTunnus: string;
};

function AccessRightsViewContainer({ hankeTunnus }: Props) {
  const { t } = useTranslation();
  const { data: hankeUsers, isLoading, isError, error } = useHankeUsers(hankeTunnus);
  const { data: hankeData } = useHanke(hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
      </Flex>
    );
  }

  if (isError && (error as AxiosError).response?.status === 404) {
    return <ErrorLoadingText>{t('common:dataNotFound')}</ErrorLoadingText>;
  }

  if (isError) {
    return <ErrorLoadingText />;
  }

  if (!hankeUsers || !hankeData) {
    return null;
  }

  return (
    <AccessRightsView
      hankeUsers={hankeUsers}
      hankeTunnus={hankeTunnus}
      hankeName={hankeData?.nimi}
      signedInUser={signedInUser}
    />
  );
}

export default AccessRightsViewContainer;
