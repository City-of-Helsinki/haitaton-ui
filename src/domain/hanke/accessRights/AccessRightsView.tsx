import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  Notification,
  Pagination,
  SearchInput,
  Table,
  Link as HDSLink,
  IconEnvelope,
  IconCheckCircleFill,
  Breadcrumb,
  IconUser,
  IconClock,
  IconMenuDots,
  LoadingSpinner,
} from 'hds-react';
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useMutation } from 'react-query';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import styles from './AccessRightsView.module.scss';
import { Language } from '../../../common/types/language';
import { HankeUser, SignedInUser } from '../hankeUsers/hankeUser';
import useHankeViewPath from '../hooks/useHankeViewPath';
import { resendInvitation } from '../hankeUsers/hankeUsersApi';
import Container from '../../../common/components/container/Container';
import UserCard from './UserCard';
import MainHeading from '../../../common/components/mainHeading/MainHeading';

function UserIcon({
  user,
  signedInUser,
}: Readonly<{ user: HankeUser; signedInUser?: SignedInUser }>) {
  const { t } = useTranslation();

  if (user.id === signedInUser?.hankeKayttajaId) {
    return (
      <IconUser className={styles.userIcon} aria-label={t('hankeUsers:labels:ownInformation')} />
    );
  } else {
    return user.tunnistautunut ? (
      <IconCheckCircleFill
        color="var(--color-success)"
        className={styles.userIcon}
        aria-label={t('hankeUsers:labels:userIdentified')}
      />
    ) : (
      <IconClock
        className={styles.userIcon}
        aria-label={t('hankeUsers:notifications:invitationSentSuccessLabel')}
      />
    );
  }
}

function sortCaseInsensitive(rowOneColumn: string, rowTwoColumn: string) {
  const rowOneColUpperCase = rowOneColumn.toUpperCase();
  const rowTwoColUpperCase = rowTwoColumn.toUpperCase();
  if (rowOneColUpperCase === rowTwoColUpperCase) {
    return 0;
  }
  return rowOneColUpperCase > rowTwoColUpperCase ? 1 : -1;
}

type HankeUserWithWholeName = HankeUser & { nimi: string };

function addWholeName(user: HankeUser): HankeUserWithWholeName {
  return { ...user, nimi: `${user.etunimi} ${user.sukunimi}` };
}

const NAME_KEY = 'nimi';
const EMAIL_KEY = 'sahkoposti';
const PHONE_KEY = 'puhelinnumero';
const ACCESS_RIGHT_LEVEL_KEY = 'kayttooikeustaso';

type Props = {
  hankeUsers: HankeUser[];
  hankeTunnus: string;
  hankeName: string;
  signedInUser?: SignedInUser;
};

function AccessRightsView({ hankeUsers, hankeTunnus, hankeName, signedInUser }: Readonly<Props>) {
  const { t, i18n } = useTranslation();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const [usersData, setUsersData] = useState<(HankeUserWithWholeName & { modified?: boolean })[]>(
    () => hankeUsers.map(addWholeName),
  );

  const columns: Column<HankeUserWithWholeName>[] = useMemo(() => {
    return [
      { accessor: NAME_KEY },
      { accessor: EMAIL_KEY },
      { accessor: PHONE_KEY },
      { accessor: ACCESS_RIGHT_LEVEL_KEY },
    ];
  }, []);

  const {
    page,
    pageCount,
    state: { pageIndex },
    toggleSortBy,
    gotoPage,
    setFilter,
  } = useTable<HankeUserWithWholeName>(
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
    setUsersData(hankeUsers.map(addWholeName));
  }, [hankeUsers]);

  const resendInvitationMutation = useMutation(resendInvitation);
  // List of user ids for tracking which users have been sent the invitation link
  const linksSentTo = useRef<string[]>([]);

  const [usersSearchValue, setUsersSearchValue] = useState('');

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

  function getUserName(args: HankeUserWithWholeName) {
    return (
      <Flex>
        <UserIcon user={args} signedInUser={signedInUser} />
        <p>{args.nimi}</p>
      </Flex>
    );
  }

  function getAccessRightLabel(args: HankeUser) {
    return t(`hankeUsers:accessRightLevels:${args.kayttooikeustaso}`);
  }

  function getInvitationMenu(args: HankeUser) {
    if (args.tunnistautunut) {
      return <></>;
    }

    const linkSent = linksSentTo.current.includes(args.id);
    const isSending =
      resendInvitationMutation.isLoading && resendInvitationMutation.variables === args.id;

    function sendInvitation() {
      resendInvitationMutation.mutate(args.id, {
        onSuccess(data) {
          linksSentTo.current.push(data);
        },
      });
    }

    return (
      <Menu>
        <MenuButton>
          <Box height="16px">
            {isSending ? (
              <LoadingSpinner small />
            ) : (
              <IconMenuDots
                style={{ display: 'block' }}
                color="var(--color-bus)"
                aria-label={t('hankeUsers:labels:userMenu')}
              />
            )}
          </Box>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={sendInvitation} isDisabled={linkSent}>
            <Flex alignItems="center" gap="var(--spacing-2-xs)" color="var(--color-bus)">
              <IconEnvelope size="xs" />
              {t('hankeUsers:buttons:resendInvitation')}
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  const tableCols = [
    {
      headerName: t('form:yhteystiedot:labels:nimi'),
      key: NAME_KEY,
      isSortable: true,
      customSortCompareFunction: sortCaseInsensitive,
      transform: getUserName,
    },
    {
      headerName: t('form:yhteystiedot:labels:email'),
      key: EMAIL_KEY,
      isSortable: true,
      customSortCompareFunction: sortCaseInsensitive,
    },
    {
      headerName: t('form:yhteystiedot:labels:puhelinnumero'),
      key: PHONE_KEY,
      isSortable: false,
    },
    {
      headerName: t('hankeUsers:accessRights'),
      key: ACCESS_RIGHT_LEVEL_KEY,
      isSortable: true,
      transform: getAccessRightLabel,
    },
  ];

  if (signedInUser?.kayttooikeudet.includes('RESEND_INVITATION')) {
    tableCols.push({
      headerName: null,
      key: 'invitationMenu',
      isSortable: false,
      transform: getInvitationMenu,
    });
  }

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <Container>
          <div className={styles.breadcrumb}>
            <Breadcrumb
              ariaLabel={t('hankeList:breadcrumb:ariaLabel')}
              list={[
                { path: hankeViewPath, title: `${hankeName} (${hankeTunnus})` },
                {
                  path: null,
                  title: t('hankeUsers:userManagementTitle'),
                },
              ]}
            />
          </div>
          <MainHeading spacingBottom="l">{t('hankeUsers:userManagementTitle')}</MainHeading>
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

        <Box marginBottom="var(--spacing-l)">
          <h2 className="heading-l">{t('hankeUsers:users')}</h2>
        </Box>

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
              <UserCard
                key={row.original.id}
                user={row.original}
                headingIcon={<UserIcon user={row.original} signedInUser={signedInUser} />}
              >
                <Box marginBottom="var(--spacing-s)">
                  <strong>{t('hankeUsers:accessRight')}:</strong>{' '}
                  {getAccessRightLabel(row.original)}
                </Box>
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
