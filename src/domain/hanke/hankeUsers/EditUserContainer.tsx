import { Flex } from '@chakra-ui/react';
import { LoadingSpinner } from 'hds-react';
import { useHankeUser } from './hooks/useHankeUser';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import EditUserView from './EditUserView';
import useHanke from '../hooks/useHanke';
import { usePermissionsForHanke } from './hooks/useUserRightsForHanke';
import { useHankeUsers } from './hooks/useHankeUsers';
import { useTranslation } from 'react-i18next';

type Props = {
  hankeTunnus?: string;
  id?: string;
};

function EditUserContainer({ hankeTunnus, id }: Readonly<Props>) {
  const { data: user, isLoading, isError: userLoadError } = useHankeUser(id);
  const { data: hanke, isError: hankeLoadError } = useHanke(hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);
  const { data: hankeUsers } = useHankeUsers(hankeTunnus);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner
          loadingText={t('common:components:loadingSpinner:loadingText')}
          loadingFinishedText={t('common:components:loadingSpinner:loadingFinishedText')}
        />
      </Flex>
    );
  }

  if (userLoadError || hankeLoadError) {
    return <ErrorLoadingText />;
  }

  if (!user || !hankeTunnus) {
    return null;
  }

  return (
    <EditUserView
      user={user}
      hankeUsers={hankeUsers}
      signedInUser={signedInUser}
      hankeTunnus={hankeTunnus}
      hankeName={hanke?.nimi}
    />
  );
}

export default EditUserContainer;
