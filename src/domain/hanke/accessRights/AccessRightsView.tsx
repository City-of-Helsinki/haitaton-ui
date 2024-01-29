import React, { useEffect, useMemo, useState } from 'react';
import {
  Pagination,
  SearchInput,
  Table,
  IconEnvelope,
  IconCheckCircleFill,
  Breadcrumb,
  IconUser,
  IconClock,
  IconMenuDots,
  LoadingSpinner,
  IconPen,
  Button,
} from 'hds-react';
import { Box, Flex, Grid, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AccessRightsView.module.scss';
import { Language } from '../../../common/types/language';
import { HankeUser, SignedInUser } from '../hankeUsers/hankeUser';
import useHankeViewPath from '../hooks/useHankeViewPath';
import Container from '../../../common/components/container/Container';
import UserCard from './UserCard';
import MainHeading from '../../../common/components/mainHeading/MainHeading';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import AccessRightsInfo from './AccessRightsInfo';
import useResendInvitation from '../hankeUsers/hooks/useResendInvitation';
import {
  InvitationErrorNotification,
  InvitationSuccessNotification,
} from '../hankeUsers/InvitationNotification';

function UserIcon({
  user,
  signedInUser,
}: Readonly<{ user: HankeUser; signedInUser?: SignedInUser }>) {
  const { t } = useTranslation();

  if (user.id === signedInUser?.hankeKayttajaId) {
    return (
      <IconUser
        className={styles.userIcon}
        ariaHidden={false}
        ariaLabel={t('hankeUsers:labels:ownInformation')}
      />
    );
  } else {
    return user.tunnistautunut ? (
      <IconCheckCircleFill
        color="var(--color-success)"
        className={styles.userIcon}
        ariaHidden={false}
        ariaLabel={t('hankeUsers:labels:userIdentified')}
      />
    ) : (
      <IconClock
        className={styles.userIcon}
        ariaHidden={false}
        ariaLabel={t('hankeUsers:notifications:invitationSentSuccessLabel')}
      />
    );
  }
}

function sort(rowOneColumn: string, rowTwoColumn: string) {
  if (rowOneColumn === rowTwoColumn) {
    return 0;
  }
  return rowOneColumn > rowTwoColumn ? 1 : -1;
}

function sortCaseInsensitive(rowOneColumn: string, rowTwoColumn: string) {
  const rowOneColUpperCase = rowOneColumn.toUpperCase();
  const rowTwoColUpperCase = rowTwoColumn.toUpperCase();
  return sort(rowOneColUpperCase, rowTwoColUpperCase);
}

type HankeUserWithWholeName = HankeUser & { nimi: string };

function addWholeName(user: HankeUser): HankeUserWithWholeName {
  return { ...user, nimi: `${user.etunimi} ${user.sukunimi}` };
}

const NAME_KEY = 'nimi';
const ROLES_KEY = 'roolit';
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
  const navigate = useNavigate();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const getEditUserPath = useLinkPath(ROUTES.EDIT_USER);
  const [usersData, setUsersData] = useState<HankeUserWithWholeName[]>(() =>
    hankeUsers.map(addWholeName),
  );

  const columns: Column<HankeUserWithWholeName>[] = useMemo(() => {
    return [
      { accessor: NAME_KEY },
      { accessor: ROLES_KEY, sortType: 'array' },
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
        array: (row1, row2, columnName) => {
          const rowOneColumnSorted: string[] = row1.values[columnName].toSorted(
            (a: string, b: string) => sort(a, b),
          );
          const rowTwoColumnSorted: string[] = row2.values[columnName].toSorted(
            (a: string, b: string) => sort(a, b),
          );
          return sort(rowOneColumnSorted.join(' '), rowTwoColumnSorted.join(' '));
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

  const { resendInvitationMutation, linksSentTo, sendInvitation } = useResendInvitation();

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

  function navigateToEditUserView(id: string) {
    navigate(getEditUserPath({ hankeTunnus, id }));
  }

  function canEditUser(user: HankeUser) {
    return (
      user.id === signedInUser?.hankeKayttajaId ||
      signedInUser?.kayttooikeudet.includes('MODIFY_USER')
    );
  }

  function getUserName(args: HankeUserWithWholeName) {
    return (
      <Flex>
        <UserIcon user={args} signedInUser={signedInUser} />
        <p>{args.nimi}</p>
      </Flex>
    );
  }

  function getUserRoles(args: HankeUser) {
    return (
      <div>
        {args.roolit.map((role) => (
          <div>{t(`hankeUsers:roleLabels:${role}`)}</div>
        ))}
      </div>
    );
  }

  function getAccessRightLabel(args: HankeUser) {
    return t(`hankeUsers:accessRightLevels:${args.kayttooikeustaso}`);
  }

  function getActionButtons(args: HankeUser) {
    const linkSent = linksSentTo.current.includes(args.id);
    const isSending =
      resendInvitationMutation.isLoading && resendInvitationMutation.variables === args.id;

    return (
      <Grid gridTemplateColumns="25px 25px" gap="var(--spacing-s)" justifyContent="flex-end">
        {canEditUser(args) ? (
          <Link to={getEditUserPath({ hankeTunnus, id: args.id })}>
            <IconPen
              style={{ display: 'block' }}
              color="var(--color-bus)"
              ariaHidden={false}
              ariaLabel={t('hankeUsers:buttons:edit')}
            />
          </Link>
        ) : null}
        {!args.tunnistautunut && signedInUser?.kayttooikeudet.includes('RESEND_INVITATION') ? (
          <Menu>
            <MenuButton>
              {isSending ? (
                <LoadingSpinner small />
              ) : (
                <IconMenuDots
                  style={{ display: 'block' }}
                  color="var(--color-bus)"
                  ariaHidden={false}
                  ariaLabel={t('hankeUsers:labels:userMenu')}
                />
              )}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => sendInvitation(args)} isDisabled={linkSent}>
                <Flex alignItems="center" gap="var(--spacing-2-xs)" color="var(--color-bus)">
                  <IconEnvelope size="xs" />
                  {t('hankeUsers:buttons:resendInvitation')}
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </Grid>
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
      headerName: t('hankeUsers:role'),
      key: ROLES_KEY,
      isSortable: true,
      transform: getUserRoles,
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
    {
      headerName: null,
      key: 'actionButtons',
      isSortable: false,
      transform: getActionButtons,
    },
  ];

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
        <AccessRightsInfo />

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
                <Box marginBottom="var(--spacing-m)">
                  <strong>{t('hankeUsers:accessRight')}:</strong>{' '}
                  {getAccessRightLabel(row.original)}
                </Box>
                <Flex>
                  {canEditUser(row.original) && (
                    <Button
                      iconLeft={<IconPen />}
                      variant="secondary"
                      onClick={() => navigateToEditUserView(row.original.id)}
                    >
                      {t('hankeUsers:buttons:edit')}
                    </Button>
                  )}
                </Flex>
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
          <InvitationSuccessNotification onClose={() => resendInvitationMutation.reset()}>
            {t('hankeUsers:notifications:invitationSentSuccessText', {
              email: hankeUsers.find((user) => user.id === resendInvitationMutation.data)
                ?.sahkoposti,
            })}
          </InvitationSuccessNotification>
        )}
        {resendInvitationMutation.isError && (
          <InvitationErrorNotification onClose={() => resendInvitationMutation.reset()} />
        )}
      </Container>
    </article>
  );
}

export default AccessRightsView;
