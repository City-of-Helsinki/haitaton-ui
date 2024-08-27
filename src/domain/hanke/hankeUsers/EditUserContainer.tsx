import { Flex } from '@chakra-ui/react';
import { useHankeUser } from './hooks/useHankeUser';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import EditUserView from './EditUserView';
import useHanke from '../hooks/useHanke';
import { usePermissionsForHanke } from './hooks/useUserRightsForHanke';
import { useHankeUsers } from './hooks/useHankeUsers';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';

type Props = {
  hankeTunnus?: string;
  id?: string;
};

function EditUserContainer({ hankeTunnus, id }: Readonly<Props>) {
  const { data: user, isLoading, isError: userLoadError } = useHankeUser(id);
  const { data: hanke, isError: hankeLoadError } = useHanke(hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);
  const { data: hankeUsers } = useHankeUsers(hankeTunnus);

  if (isLoading) {
    return (
      <Flex justify="center" mt="var(--spacing-xl)">
        <LoadingSpinner />
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
