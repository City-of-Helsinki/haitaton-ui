import { useTranslation } from 'react-i18next';
import { Breadcrumb, Button, IconCheckCircleFill, IconClock, IconEnvelope } from 'hds-react';
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

function EditUserView({
  user,
  user: { id, etunimi, sukunimi, sahkoposti, puhelinnumero, tunnistautunut, kayttooikeustaso },
  hankeUsers,
  signedInUser,
  hankeTunnus,
  hankeName,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const getHankeUsersPath = useLinkPath(ROUTES.ACCESS_RIGHTS);
  const formContext = useForm({
    mode: 'onTouched',
    defaultValues: {
      etunimi,
      sukunimi,
      sahkoposti,
      puhelinnumero,
      kayttooikeustaso,
    },
  });

  const { resendInvitationMutation, linksSentTo, sendInvitation } = useResendInvitation();

  const userFullName = `${etunimi} ${sukunimi}`;

  // Options for the dropdown
  const accessRightLevelOptions: AccessRightLevelOption[] = $enum(AccessRightLevel)
    .getValues()
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
          <MainHeading spacingBottom="l">
            {t('hankeUsers:userEditTitle')}: {userFullName}
          </MainHeading>
          <Flex gap="var(--spacing-2-xs)" color="var(--color-black-60)">
            {tunnistautunut ? (
              <>
                <IconCheckCircleFill color="var(--color-success)" />
                <p>{t('hankeUsers:labels:userIdentifiedLong')}</p>
              </>
            ) : (
              <>
                <IconClock />
                <p>{t('hankeUsers:labels:invitationSent')}</p>
              </>
            )}
          </Flex>
          {!tunnistautunut && (
            <Box marginTop="var(--spacing-xl)">
              <Button
                iconLeft={<IconEnvelope />}
                theme="coat"
                onClick={() => sendInvitation(user)}
                isLoading={resendInvitationMutation.isLoading}
                disabled={linksSentTo.current.includes(id)}
              >
                {t('hankeUsers:buttons:resendInvitation')}
              </Button>
            </Box>
          )}
        </Container>
      </header>

      <Container className={styles.mainContent}>
        <AccessRightsInfo />

        <Box marginBottom="var(--spacing-l)">
          <h2 className="heading-l">{t('hankeUsers:userInfoTitle')}</h2>
        </Box>

        <FormProvider {...formContext}>
          <form className={styles.formContainer}>
            <ResponsiveGrid maxColumns={2}>
              <TextInput name="etunimi" label={t('hankeForm:labels:etunimi')} required />
              <TextInput name="sukunimi" label={t('hankeForm:labels:sukunimi')} required />
            </ResponsiveGrid>
            <ResponsiveGrid maxColumns={2}>
              <TextInput name="sahkoposti" label={t('hankeForm:labels:email')} required />
              <TextInput
                name="puhelinnumero"
                label={t('hankeForm:labels:puhelinnumero')}
                required
              />
            </ResponsiveGrid>
            <ResponsiveGrid maxColumns={2} className={styles.accessRightSelect}>
              <Dropdown
                id={id}
                name="kayttooikeustaso"
                label={t('hankeUsers:accessRights')}
                options={accessRightLevelOptions}
                disabled={isDropdownDisabled}
                isOptionDisabled={(option) =>
                  option.value === 'KAIKKI_OIKEUDET' &&
                  signedInUser?.kayttooikeustaso !== 'KAIKKI_OIKEUDET'
                }
              />
            </ResponsiveGrid>
          </form>
        </FormProvider>
      </Container>

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
    </div>
  );
}

export default EditUserView;
