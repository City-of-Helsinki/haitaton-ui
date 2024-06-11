import { Trans, useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  Button,
  IconCheckCircleFill,
  IconClock,
  IconCross,
  IconEnvelope,
  IconSaveDisketteFill,
  IconTrash,
  Link,
  Notification,
} from 'hds-react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Container from '../../../common/components/container/Container';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import { AccessRightLevel, HankeUser, SignedInUser } from './hankeUser';
import styles from './EditUserView.module.scss';
import useHankeViewPath from '../hooks/useHankeViewPath';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import AccessRightsInfo from '../accessRights/AccessRightsInfo';
import { Box, Flex } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import ResponsiveGrid from '../../../common/components/grid/ResponsiveGrid';
import TextInput from '../../../common/components/textInput/TextInput';
import { $enum } from 'ts-enum-util';
import Dropdown from '../../../common/components/dropdown/Dropdown';
import useResendInvitation from './hooks/useResendInvitation';
import {
  InvitationErrorNotification,
  InvitationSuccessNotification,
} from './InvitationNotification';
import { updateHankeUser, updateHankeUsersPermissions, updateSelf } from './hankeUsersApi';
import yup from '../../../common/utils/yup';
import { yhteyshenkiloSchema } from '../edit/hankeSchema';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import Text from '../../../common/components/text/Text';
import { showUserDeleteButton, userRoleSorter } from './utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { useUserDelete } from './hooks/useUserDelete';
import UserDeleteDialog from './UserDeleteDialog';
import UserDeleteInfoErrorNotification from './UserDeleteInfoErrorNotification';
import { useEffect, useState } from 'react';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { useFeatureFlags } from '../../../common/components/featureFlags/FeatureFlagsContext';

type Props = {
  user: HankeUser;
  hankeUsers?: HankeUser[];
  signedInUser?: SignedInUser;
  hankeTunnus: string;
  hankeName?: string;
};

type AccessRightLevelOption = {
  label: string;
  value: keyof typeof AccessRightLevel;
};

const editUserSchema = yhteyshenkiloSchema.shape({
  kayttooikeustaso: yup.mixed<keyof typeof AccessRightLevel>().defined().required(),
});

function EditUserView({
  user,
  user: {
    id,
    etunimi,
    sukunimi,
    sahkoposti,
    puhelinnumero,
    tunnistautunut,
    kayttooikeustaso,
    roolit,
    kutsuttu,
  },
  hankeUsers,
  signedInUser,
  hankeTunnus,
  hankeName,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const getHankeUsersPath = useLinkPath(ROUTES.ACCESS_RIGHTS);
  const features = useFeatureFlags();
  const formContext = useForm({
    mode: 'onTouched',
    defaultValues: {
      etunimi,
      sukunimi,
      sahkoposti,
      puhelinnumero,
      kayttooikeustaso,
    },
    resolver: yupResolver(editUserSchema),
  });
  const { handleSubmit } = formContext;

  const queryClient = useQueryClient();
  const updateSelfMutation = useMutation(updateSelf);
  const updateUserMutation = useMutation(updateHankeUser);
  const updatePermissionMutation = useMutation(updateHankeUsersPermissions);
  const { resendInvitationMutation, linksSentTo, sendInvitation } = useResendInvitation();
  const { setNotification } = useGlobalNotification();

  const { deleteInfoQueryResult, userToDelete, setDeletedUser, resetUserToDelete } =
    useUserDelete();
  const showDeleteButton = showUserDeleteButton(user, hankeUsers, signedInUser);
  const [showUserDeleteInfoErrorNotification, setShowUserDeleteInfoErrorNotification] =
    useState(false);

  useEffect(() => {
    if (deleteInfoQueryResult.isError) {
      setShowUserDeleteInfoErrorNotification(true);
    }
  }, [deleteInfoQueryResult.isError]);

  const userFullName = `${etunimi} ${sukunimi}`;
  const userRoles = roolit
    .toSorted(userRoleSorter)
    .map((role) => t(`hankeUsers:roleLabels:${role}`))
    .join(', ');

  // Options for the dropdown
  const accessRightLevelOptions: AccessRightLevelOption[] = $enum(AccessRightLevel)
    .getValues()
    .filter(
      (rightLevel) =>
        features.hanke || (rightLevel !== 'KAIKKIEN_MUOKKAUS' && rightLevel !== 'HANKEMUOKKAUS'),
    )
    .map((rightLevel) => {
      return { label: t(`hankeUsers:accessRightLevels:${rightLevel}`), value: rightLevel };
    });

  const isOnlyWithAllRights: boolean =
    kayttooikeustaso === 'KAIKKI_OIKEUDET' &&
    hankeUsers?.filter((hankeUser) => hankeUser.kayttooikeustaso === 'KAIKKI_OIKEUDET').length ===
      1;

  const canEditRights = signedInUser?.kayttooikeudet?.includes('MODIFY_EDIT_PERMISSIONS');

  const canEditAllRights =
    kayttooikeustaso === 'KAIKKI_OIKEUDET'
      ? signedInUser?.kayttooikeustaso === 'KAIKKI_OIKEUDET'
      : true;

  // Check if this user is the same as the signed in user,
  // so that user is not able to edit their own rights
  const isSignedInUser = id === signedInUser?.hankeKayttajaId;

  const isDropdownDisabled =
    isOnlyWithAllRights || !canEditRights || !canEditAllRights || isSignedInUser;

  const saveButtonIsLoading =
    updateSelfMutation.isLoading ||
    updateUserMutation.isLoading ||
    updatePermissionMutation.isLoading;
  const showUpdatedUserErrorNotification =
    updateSelfMutation.isError || updateUserMutation.isError || updatePermissionMutation.isError;

  function navigateToHankeUsersView() {
    navigate(getHankeUsersPath({ hankeTunnus }));
  }

  function handleSuccess(data: HankeUser) {
    queryClient.setQueryData(['hankeUser', data.id], data);
    setNotification(true, {
      label: t('hankeUsers:notifications:userUpdatedSuccessLabel'),
      message: t('hankeUsers:notifications:userUpdatedSuccessText'),
      type: 'success',
      dismissible: true,
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
      autoClose: true,
      autoCloseDuration: 7000,
    });
    navigateToHankeUsersView();
  }

  async function editUser(data: yup.InferType<typeof editUserSchema>) {
    if (isSignedInUser) {
      updateSelfMutation.mutate(
        {
          hankeTunnus,
          user: { sahkoposti: data.sahkoposti, puhelinnumero: data.puhelinnumero },
        },
        {
          onSuccess: handleSuccess,
        },
      );
    } else {
      try {
        const updates = tunnistautunut
          ? { sahkoposti: data.sahkoposti, puhelinnumero: data.puhelinnumero }
          : {
              etunimi: data.etunimi,
              sukunimi: data.sukunimi,
              sahkoposti: data.sahkoposti,
              puhelinnumero: data.puhelinnumero,
            };
        const updatedUser = await updateUserMutation.mutateAsync({
          hankeTunnus,
          userId: id,
          user: updates,
        });
        if (data.kayttooikeustaso !== kayttooikeustaso) {
          await updatePermissionMutation.mutateAsync({
            hankeTunnus,
            users: [{ id, kayttooikeustaso: data.kayttooikeustaso }],
          });
          updatedUser.kayttooikeustaso = data.kayttooikeustaso;
        }
        handleSuccess(updatedUser);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  function closeUpdateUserErrorNotification() {
    if (isSignedInUser) {
      updateSelfMutation.reset();
    } else {
      updateUserMutation.reset();
      updatePermissionMutation.reset();
    }
  }

  function handleUserDeleted(deletedUser: HankeUser) {
    setNotification(true, {
      label: t('hankeUsers:notifications:userDeletedLabel'),
      message: t('hankeUsers:notifications:userDeletedText'),
      type: 'success',
      dismissible: true,
      closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
      autoClose: true,
      autoCloseDuration: 4000,
    });
    if (deletedUser.id === signedInUser?.hankeKayttajaId) {
      navigate(HANKEPORTFOLIO.path);
    } else {
      navigateToHankeUsersView();
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Container>
          <div className={styles.breadcrumb}>
            <Breadcrumb
              ariaLabel={t('hankeList:breadcrumb:ariaLabel')}
              list={[
                { path: hankeViewPath, title: `${hankeName} (${hankeTunnus})` },
                {
                  path: getHankeUsersPath({ hankeTunnus }),
                  title: t('hankeUsers:userManagementTitle'),
                },
                {
                  path: null,
                  title: t('hankeUsers:userEditTitle'),
                },
              ]}
            />
          </div>
          <MainHeading spacingBottom="m">
            {t('hankeUsers:userEditTitle')}: {userFullName}
          </MainHeading>
          {roolit.length > 0 && (
            <Text tag="p" styleAs="body-s" spacingBottom="s">
              <Box as="strong" marginRight="var(--spacing-s)">
                {t('hankeUsers:role')}:
              </Box>
              {userRoles}
            </Text>
          )}
          <Flex gap="var(--spacing-2-xs)" color="var(--color-black-60)">
            {tunnistautunut ? (
              <>
                <IconCheckCircleFill color="var(--color-success)" />
                <p>{t('hankeUsers:labels:userIdentifiedLong')}</p>
              </>
            ) : (
              <>
                <IconClock />
                <p>
                  {t('hankeUsers:labels:invitationSentLong', {
                    date: formatToFinnishDate(kutsuttu),
                  })}
                </p>
              </>
            )}
          </Flex>
          {(!tunnistautunut || showDeleteButton) && (
            <Flex marginTop="var(--spacing-xl)" gap="var(--spacing-s)" flexWrap="wrap">
              {!tunnistautunut && (
                <Button
                  iconLeft={<IconEnvelope />}
                  theme="coat"
                  onClick={() => sendInvitation(user)}
                  isLoading={resendInvitationMutation.isLoading}
                  disabled={linksSentTo.current.includes(id)}
                >
                  {t('hankeUsers:buttons:resendInvitation')}
                </Button>
              )}
              {showDeleteButton && (
                <Button
                  iconLeft={<IconTrash />}
                  variant="danger"
                  isLoading={deleteInfoQueryResult.isLoading}
                  onClick={() => setDeletedUser(user)}
                >
                  {t('hankeUsers:buttons:delete')}
                </Button>
              )}
            </Flex>
          )}
        </Container>
      </header>

      <Container className={styles.mainContent}>
        <AccessRightsInfo />

        <Box marginBottom="var(--spacing-l)">
          <h2 className="heading-l">{t('hankeUsers:userInfoTitle')}</h2>
        </Box>

        <FormProvider {...formContext}>
          <form onSubmit={handleSubmit(editUser)} className={styles.formContainer}>
            <ResponsiveGrid maxColumns={2}>
              <TextInput
                name="etunimi"
                label={t('hankeForm:labels:etunimi')}
                required
                readOnly={tunnistautunut}
              />
              <TextInput
                name="sukunimi"
                label={t('hankeForm:labels:sukunimi')}
                required
                readOnly={tunnistautunut}
              />
            </ResponsiveGrid>
            <ResponsiveGrid maxColumns={2}>
              <TextInput name="sahkoposti" label={t('hankeForm:labels:email')} required />
              <TextInput
                name="puhelinnumero"
                label={t('hankeForm:labels:puhelinnumero')}
                required
              />
            </ResponsiveGrid>
            <ResponsiveGrid maxColumns={2}>
              <Dropdown
                id={id}
                name="kayttooikeustaso"
                label={t('hankeUsers:accessRights')}
                options={accessRightLevelOptions}
                required
                disabled={isDropdownDisabled}
                isOptionDisabled={(option) =>
                  option.value === 'KAIKKI_OIKEUDET' &&
                  signedInUser?.kayttooikeustaso !== 'KAIKKI_OIKEUDET'
                }
              />
            </ResponsiveGrid>

            <Flex
              marginTop="var(--spacing-xl)"
              marginBottom="var(--spacing-xl)"
              gap="var(--spacing-s)"
            >
              <Button
                iconLeft={<IconSaveDisketteFill />}
                isLoading={saveButtonIsLoading}
                type="submit"
              >
                {t('form:buttons:saveChanges')}
              </Button>
              <Button
                iconLeft={<IconCross />}
                variant="secondary"
                onClick={navigateToHankeUsersView}
              >
                {t('common:confirmationDialog:cancelButton')}
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </Container>

      {showUpdatedUserErrorNotification && (
        <Notification
          position="top-right"
          dismissible
          type="error"
          label={t('hankeUsers:notifications:userUpdatedErrorLabel')}
          closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
          onClose={closeUpdateUserErrorNotification}
        >
          <Trans i18nKey="hankeUsers:notifications:userUpdatedErrorText">
            <p>
              Käyttäjätietojen päivityksessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota
              yhteyttä Haitattoman tekniseen tukeen sähköpostiosoitteessa
              <Link href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</Link>.
            </p>
          </Trans>
        </Notification>
      )}

      {resendInvitationMutation.isSuccess && (
        <InvitationSuccessNotification onClose={() => resendInvitationMutation.reset()}>
          {t('hankeUsers:notifications:invitationSentSuccessText', {
            email: sahkoposti,
          })}
        </InvitationSuccessNotification>
      )}
      {resendInvitationMutation.isError && (
        <InvitationErrorNotification onClose={() => resendInvitationMutation.reset()} />
      )}

      {deleteInfoQueryResult.data && (
        <UserDeleteDialog
          isOpen={deleteInfoQueryResult.isSuccess}
          onClose={resetUserToDelete}
          onDelete={(deletedUser) => handleUserDeleted(deletedUser)}
          deleteInfo={deleteInfoQueryResult.data}
          userToDelete={userToDelete}
        />
      )}

      {showUserDeleteInfoErrorNotification && (
        <UserDeleteInfoErrorNotification
          onClose={() => {
            setShowUserDeleteInfoErrorNotification(false);
            resetUserToDelete();
          }}
        />
      )}
    </div>
  );
}

export default EditUserView;
