import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useHankeUser } from './hooks/useHankeUser';
import ErrorLoadingText from '../../../common/components/errorLoadingText/ErrorLoadingText';
import EditUserView from './EditUserView';
import useHanke from '../hooks/useHanke';
import { usePermissionsForHanke } from './hooks/useUserRightsForHanke';
import { useHankeUsers } from './hooks/useHankeUsers';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import Breadcrumbs, { BREADCRUMBS } from '../../../common/components/breadcrumbs/Breadcrumbs';
import useHankeViewPath from '../hooks/useHankeViewPath';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

type Props = {
  hankeTunnus?: string;
  id?: string;
};

function EditUserContainer({ hankeTunnus, id }: Readonly<Props>) {
  const { t } = useTranslation();
  const { data: user, isLoading, isError: userLoadError } = useHankeUser(id);
  const { data: hanke, isError: hankeLoadError } = useHanke(hankeTunnus);
  const { data: signedInUser } = usePermissionsForHanke(hankeTunnus);
  const { data: hankeUsers } = useHankeUsers(hankeTunnus);
  const hankeViewPath = useHankeViewPath(hanke?.hankeTunnus ?? null);
  const getUserManagementPath = useLinkPath(ROUTES.ACCESS_RIGHTS);

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
    <>
      {hanke && (
        <Breadcrumbs
          breadcrumbs={[
            BREADCRUMBS.omatHankkeet,
            {
              path: hankeViewPath,
              title: `${hanke.nimi} (${hankeTunnus})`,
              skipTranslate: true,
            },
            {
              path: getUserManagementPath({ hankeTunnus }),
              title: t('hankeUsers:userManagementTitle'),
              skipTranslate: true,
            },
            {
              path: null,
              title: 'hankeUsers:userEditTitle',
            },
          ]}
        />
      )}
      <EditUserView
        user={user}
        hankeUsers={hankeUsers}
        signedInUser={signedInUser}
        hankeTunnus={hankeTunnus}
      />
    </>
  );
}

export default EditUserContainer;
