import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  Button,
  IconAngleLeft,
  IconSaveDisketteFill,
  Notification,
  Pagination,
  SearchInput,
  Select,
  Table,
  Link as HDSLink,
  IconEnvelope,
  IconCheckCircleFill,
} from 'hds-react';
import { cloneDeep } from 'lodash';
import { Box, Flex } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import { $enum } from 'ts-enum-util';
import { Link } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import styles from './AccessRightsView.module.scss';
import { Language } from '../../../common/types/language';
import { HankeUser, AccessRightLevel, SignedInUser } from '../hankeUsers/hankeUser';
import useHankeViewPath from '../hooks/useHankeViewPath';
import { resendInvitation, updateHankeUsers } from '../hankeUsers/hankeUsersApi';
import Container from '../../../common/components/container/Container';
import UserCard from './UserCard';
import MainHeading from '../../../common/components/mainHeading/MainHeading';

function sortCaseInsensitive(rowOneColumn: string, rowTwoColumn: string) {
  const rowOneColUpperCase = rowOneColumn.toUpperCase();
  const rowTwoColUpperCase = rowTwoColumn.toUpperCase();
  if (rowOneColUpperCase === rowTwoColUpperCase) {
    return 0;
  }
  return rowOneColUpperCase > rowTwoColUpperCase ? 1 : -1;
}

type Props = {
  hankeUsers: HankeUser[];
  hankeTunnus: string;
  hankeName: string;
  signedInUser?: SignedInUser;
};

type AccessRightLevelOption = {
  label: string;
  value: keyof typeof AccessRightLevel;
};

const NAME_KEY = 'nimi';
const EMAIL_KEY = 'sahkoposti';
const ACCESS_RIGHT_LEVEL_KEY = 'kayttooikeustaso';
const USER_IDENTIFIED_KEY = 'tunnistautunut';

function AccessRightsView({ hankeUsers, hankeTunnus, hankeName, signedInUser }: Props) {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const [usersData, setUsersData] = useState<(HankeUser & { modified?: boolean })[]>(hankeUsers);
  const modifiedUsers = usersData.filter((user) => user.modified);
  const saveButtonDisabled = modifiedUsers.length === 0;

  const columns: Column<HankeUser>[] = useMemo(() => {
    return [
      { accessor: NAME_KEY },
      { accessor: EMAIL_KEY },
      { accessor: ACCESS_RIGHT_LEVEL_KEY },
      { accessor: USER_IDENTIFIED_KEY },
    ];
  }, []);

  const {
    page,
    pageCount,
    state: { pageIndex },
    toggleSortBy,
    gotoPage,
    setFilter,
  } = useTable<HankeUser>(
    {
      columns,
      data: usersData,
      autoResetFilters: false,
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          const rowOneColumn: string = row1.values[columnName];
          const rowTwoColumn: string = row2.values[columnName];
          return sortCaseInsensitive(rowOneColumn, rowTwoColumn);
        },
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setUsersData(hankeUsers);
  }, [hankeUsers]);

  const updateUsersMutation = useMutation(updateHankeUsers);
  const resendInvitationMutation = useMutation(resendInvitation);
  // List of user ids for tracking which users have been sent the invitation link
  const linksSentTo = useRef<string[]>([]);

  const [usersSearchValue, setUsersSearchValue] = useState('');

  const accessRightLevelOptions: AccessRightLevelOption[] = $enum(AccessRightLevel)
    .getValues()
    .map((rightLevel) => {
      return { label: t(`hankeUsers:accessRightLevels:${rightLevel}`), value: rightLevel };
    });

  function handleUserSearch(searchTerm: string) {
    setUsersSearchValue(searchTerm);
  }

  const filterUsers = useAsyncDebounce((searchTerm: string) => {
    setFilter(NAME_KEY, searchTerm);
  }, 200);

  useEffect(() => {
    filterUsers(usersSearchValue);
  }, [usersSearchValue, filterUsers]);

  function handleTablePageChange(e: React.MouseEvent, index: number) {
    e.preventDefault();
    gotoPage(index);
  }

  function handleTableSort(order: 'asc' | 'desc', colKey: string, handleSort: () => void) {
    toggleSortBy(colKey, order === 'desc');
    handleSort();
  }

  function getAccessRightSelect(args: HankeUser) {
    const isOnlyWithAllRights: boolean =
      args.kayttooikeustaso === 'KAIKKI_OIKEUDET' &&
      usersData.filter((user) => user.kayttooikeustaso === 'KAIKKI_OIKEUDET').length === 1;

    const canEditRights = signedInUser?.kayttooikeudet?.includes('MODIFY_EDIT_PERMISSIONS');

    const canEditAllRights =
      args.kayttooikeustaso === 'KAIKKI_OIKEUDET'
        ? signedInUser?.kayttooikeustaso === 'KAIKKI_OIKEUDET'
        : true;

    // Check if this user is the same as the signed in user,
    // so that user is not able to edit their own rights
    const isSignedInUser = args.id === signedInUser?.hankeKayttajaId;

    const isDisabled = isOnlyWithAllRights || !canEditRights || !canEditAllRights || isSignedInUser;

    function handleRightsChange(e: AccessRightLevelOption) {
      setUsersData((prevData) => {
        const newData = prevData.map((user) => {
          if (user.id === args.id) {
            const modifiedUser = cloneDeep(user);
            modifiedUser.kayttooikeustaso = e.value;
            modifiedUser.modified = true;
            return modifiedUser;
          }
          return user;
        });
        return newData;
      });
    }

    return (
      <Select<AccessRightLevelOption>
        id={args.id}
        aria-labelledby={t('hankeUsers:accessRights')}
        options={accessRightLevelOptions}
        value={accessRightLevelOptions.find((option) => option.value === args.kayttooikeustaso)}
        onChange={handleRightsChange}
        isOptionDisabled={(option) =>
          option.value === 'KAIKKI_OIKEUDET' && signedInUser?.kayttooikeustaso !== 'KAIKKI_OIKEUDET'
        }
        disabled={isDisabled}
        className={styles.accessRightSelect}
      />
    );
  }

  function getInvitationResendButton(args: HankeUser) {
    if (args.tunnistautunut) {
      return (
        <Flex alignItems="baseline">
          <IconCheckCircleFill
            color="var(--color-success)"
            style={{ marginRight: 'var(--spacing-3-xs)', alignSelf: 'center' }}
            aria-hidden
          />
          <p>{t('hankeUsers:userIdentified')}</p>
        </Flex>
      );
    }

    const linkSent = linksSentTo.current.includes(args.id);
    const buttonText = linkSent
      ? t('hankeUsers:buttons:invitationSent')
      : t('hankeUsers:buttons:resendInvitation');
    const isButtonLoading =
      resendInvitationMutation.isLoading && resendInvitationMutation.variables === args.id;

    function sendInvitation() {
      resendInvitationMutation.mutate(args.id, {
        onSuccess(data) {
          linksSentTo.current.push(data);
        },
      });
    }

    return (
      <div className={styles.invitationSendButtonContainer}>
        <Button
          variant="secondary"
          className={styles.invitationSendButton}
          iconLeft={<IconEnvelope aria-hidden />}
          onClick={sendInvitation}
          disabled={linkSent}
          isLoading={isButtonLoading}
        >
          {buttonText}
        </Button>
      </div>
    );
  }

  function updateUsers() {
    const users: Pick<HankeUser, 'id' | 'kayttooikeustaso'>[] = modifiedUsers.map((user) => {
      return {
        id: user.id,
        kayttooikeustaso: user.kayttooikeustaso,
      };
    });
    updateUsersMutation.mutate(
      { hankeTunnus, users },
      {
        onSuccess() {
          queryClient.invalidateQueries(['hankeUsers', hankeTunnus]);
        },
      },
    );
  }

  const tableCols = [
    {
      headerName: t('form:yhteystiedot:labels:nimi'),
      key: NAME_KEY,
      isSortable: true,
      customSortCompareFunction: sortCaseInsensitive,
    },
    {
      headerName: t('form:yhteystiedot:labels:email'),
      key: EMAIL_KEY,
      isSortable: true,
      customSortCompareFunction: sortCaseInsensitive,
    },
    {
      headerName: t('hankeUsers:accessRights'),
      key: ACCESS_RIGHT_LEVEL_KEY,
      transform: getAccessRightSelect,
    },
  ];

  if (signedInUser?.kayttooikeudet.includes('RESEND_INVITATION')) {
    tableCols.push({
      headerName: '',
      key: USER_IDENTIFIED_KEY,
      transform: getInvitationResendButton,
    });
  }

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <Container>
          <Link to={hankeViewPath} className={styles.hankeLink}>
            <IconAngleLeft aria-hidden="true" />
            <Text tag="h2" styleAs="h3" weight="bold">
              {hankeName} ({hankeTunnus})
            </Text>
          </Link>
          <MainHeading spacingBottom="l">{t('hankeUsers:manageRights')}</MainHeading>
        </Container>
      </header>

      <Container className={styles.mainContent}>
        <Accordion
          className={styles.infoAccordion}
          language={i18n.language as Language}
          heading={t('hankeUsers:accessRightsInfo:heading')}
        >
          <ul className={styles.infoList}>
            <li>
              <Trans i18nKey="hankeUsers:accessRightsInfo:KAIKKI_OIKEUDET">
                <strong>Kaikki oikeudet</strong> mahdollistaa hankkeen ja sen hakemusten sisällön
                muokkaamisen, kaikkien käyttöoikeuksien muokkaamisen sekä hankkeen poistamisen, kun
                hankkeella ei ole päätöksen saaneita hakemuksia.
              </Trans>
            </li>
            <li>
              <Trans i18nKey="hankeUsers:accessRightsInfo:KAIKKIEN_MUOKKAUS">
                <strong>Hankkeen ja hakemusten muokkaus -oikeus</strong> mahdollistaa hankkeen ja
                sen hakemusten sisällön muokkaamisen ja luonnin sekä muiden käyttöoikeuksien
                muokkaamisen, paitsi “Kaikki oikeudet”, jolla voi poistaa hankkeen.
              </Trans>
            </li>
            <li>
              <Trans i18nKey="hankeUsers:accessRightsInfo:HANKEMUOKKAUS">
                <strong>Hankemuokkaus-oikeus</strong> mahdollistaa hankkeen tietojen muokkaamisen,
                mutta ei käyttöoikeuksien muokkausta. Hakemustietoihin on tällöin katseluoikeudet.
              </Trans>
            </li>
            <li>
              <Trans i18nKey="hankeUsers:accessRightsInfo:HAKEMUSASIOINTI">
                <strong>Hakemusasiointi-oikeus</strong> mahdollistaa uusien hakemusten luomisen
                hankkeelle sekä hankkeen hakemusten tietojen muokkaamisen.
              </Trans>
            </li>
            <li>
              <Trans i18nKey="hankeUsers:accessRightsInfo:KATSELUOIKEUS">
                <strong>Katselu-oikeus</strong> mahdollistaa hankkeen ja sen hakemusten tietojen
                katselun. Katseluoikeus asetetaan automaattisesti kaikille hankkeelle ja
                hakemukselle lisätyille henkilöille.
              </Trans>
            </li>
          </ul>
          <p>{t('hankeUsers:accessRightsInfo:modifyInfo')}</p>
        </Accordion>

        <SearchInput
          className={styles.searchInput}
          label={t('hankePortfolio:search')}
          placeholder={t('hankeUsers:search:placeholder')}
          helperText={t('hankeUsers:search:helperText')}
          value={usersSearchValue}
          onChange={handleUserSearch}
          onSubmit={handleUserSearch}
        />

        <div className={styles.table}>
          <Table
            cols={tableCols}
            rows={page.map((row) => row.original)}
            onSort={handleTableSort}
            indexKey="id"
            variant="light"
            dataTestId="access-right-table"
          />
        </div>
        <div className={styles.userCards}>
          {page.map((row) => {
            return (
              <UserCard key={row.original.id} user={row.original}>
                <Box marginBottom="var(--spacing-s)">{getAccessRightSelect(row.original)}</Box>
                {signedInUser?.kayttooikeudet.includes('RESEND_INVITATION')
                  ? getInvitationResendButton(row.original)
                  : null}
              </UserCard>
            );
          })}
        </div>

        <div className={styles.pagination}>
          <Pagination
            language={i18n.language as Language}
            onChange={handleTablePageChange}
            pageHref={() => ''}
            pageCount={pageCount}
            pageIndex={pageIndex}
            paginationAriaLabel={t('hankeList:paginatioAriaLabel')}
          />
        </div>

        <Flex justifyContent="flex-end" mb="var(--spacing-l)">
          <Button
            onClick={updateUsers}
            iconLeft={<IconSaveDisketteFill />}
            disabled={saveButtonDisabled}
          >
            {t('form:buttons:saveChanges')}
          </Button>
        </Flex>

        {updateUsersMutation.isSuccess && (
          <Notification
            position="top-right"
            dismissible
            autoClose
            autoCloseDuration={4000}
            type="success"
            label={t('hankeUsers:notifications:rightsUpdatedSuccessLabel')}
            closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
            onClose={() => updateUsersMutation.reset()}
          >
            {t('hankeUsers:notifications:rightsUpdatedSuccessText')}
          </Notification>
        )}
        {updateUsersMutation.isError && (
          <Notification
            position="top-right"
            dismissible
            type="error"
            label={t('hankeUsers:notifications:rightsUpdatedErrorLabel')}
            closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
            onClose={() => updateUsersMutation.reset()}
          >
            <Trans i18nKey="hankeUsers:notifications:rightsUpdatedErrorText">
              <p>
                Käyttöoikeuksien päivityksessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota
                yhteyttä Haitattoman tekniseen tukeen sähköpostiosoitteessa
                <HDSLink href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</HDSLink>.
              </p>
            </Trans>
          </Notification>
        )}

        {resendInvitationMutation.isSuccess && (
          <Notification
            position="top-right"
            dismissible
            autoClose
            autoCloseDuration={4000}
            type="success"
            label={t('hankeUsers:notifications:invitationSentSuccessLabel')}
            closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
            onClose={() => resendInvitationMutation.reset()}
          >
            {t('hankeUsers:notifications:invitationSentSuccessText', {
              email: hankeUsers.find((user) => user.id === resendInvitationMutation.data)
                ?.sahkoposti,
            })}
          </Notification>
        )}
        {resendInvitationMutation.isError && (
          <Notification
            position="top-right"
            dismissible
            type="error"
            label={t('hankeUsers:notifications:invitationSentErrorLabel')}
            closeButtonLabelText={t('common:components:notification:closeButtonLabelText')}
            onClose={() => resendInvitationMutation.reset()}
          >
            <Trans i18nKey="hankeUsers:notifications:invitationSentErrorText">
              <p>
                Kutsulinkin lähettämisessä tapahtui virhe. Yritä myöhemmin uudelleen tai ota
                yhteyttä Haitattoman tekniseen tukeen sähköpostiosoitteessa
                <HDSLink href="mailto:haitatontuki@hel.fi">haitatontuki@hel.fi</HDSLink>.
              </p>
            </Trans>
          </Notification>
        )}
      </Container>
    </article>
  );
}

export default AccessRightsView;
