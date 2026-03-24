import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import {
  SearchInput,
  Table,
  IconEnvelope,
  IconCheckCircleFill,
  IconUser,
  IconClock,
  IconMenuDots,
  IconPen,
  IconTrash,
  IconSize,
  ButtonVariant,
} from 'hds-react';
import { Box, Flex, Grid, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
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
import { useQueryClient } from 'react-query';
import styles from './AccessRightsView.module.scss';
import { HankeUser, SignedInUser } from '../hankeUsers/hankeUser';
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
import { showUserDeleteButton, userRoleSorter } from '../hankeUsers/utils';
import { formatToFinnishDate } from '../../../common/utils/date';
import { useUserDelete } from '../hankeUsers/hooks/useUserDelete';
import UserDeleteDialog from '../hankeUsers/UserDeleteDialog';
import UserDeleteNotification from '../hankeUsers/UserDeleteNotification';
import UserDeleteInfoErrorNotification from '../hankeUsers/UserDeleteInfoErrorNotification';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { useGlobalNotification } from '../../../common/components/globalNotification/GlobalNotificationContext';
import Text from '../../../common/components/text/Text';
import LoadingSpinner from '../../../common/components/spinner/LoadingSpinner';
import Button from '../../../common/components/button/Button';
import Pagination from '../../../common/components/pagination/Pagination';

function UserIcon({
  user,
  signedInUser,
}: Readonly<{ user: HankeUser; signedInUser?: SignedInUser }>) {
  const { t } = useTranslation();

  if (user.id === signedInUser?.hankeKayttajaId) {
    return (
      <Tooltip label={t('hankeUsers:labels:ownInformation')}>
        <Flex>
          <IconUser
            className={styles.userIcon}
            aria-hidden={false}
            aria-label={t('hankeUsers:labels:ownInformation')}
          />
        </Flex>
      </Tooltip>
    );
  } else {
    return user.tunnistautunut ? (
      <Tooltip label={t('hankeUsers:labels:userIdentified')}>
        <Flex>
          <IconCheckCircleFill
            color="var(--color-success)"
            className={styles.userIcon}
            aria-hidden={false}
            aria-label={t('hankeUsers:labels:userIdentified')}
          />
        </Flex>
      </Tooltip>
    ) : (
      <Tooltip
        label={t('hankeUsers:labels:invitationSent', {
          date: formatToFinnishDate(user.kutsuttu),
        })}
      >
        <Flex>
          <IconClock
            className={styles.userIcon}
            aria-hidden={false}
            aria-label={t('hankeUsers:labels:invitationSent', {
              date: formatToFinnishDate(user.kutsuttu),
            })}
          />
        </Flex>
      </Tooltip>
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
  signedInUser?: SignedInUser;
  readonly?: boolean;
};

function AccessRightsView({ hankeUsers, hankeTunnus, signedInUser, readonly }: Readonly<Props>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const queryClient = useQueryClient();
  const getEditUserPath = useLinkPath(ROUTES.EDIT_USER);
  const { setNotification } = useGlobalNotification();
  const [usersData, setUsersData] = useState<HankeUserWithWholeName[]>(() =>
    hankeUsers.map((u) => addWholeName({ ...u, roolit: [...u.roolit].sort(userRoleSorter) })),
  );

  const { deleteInfoQueryResult, userToDelete, setDeletedUser, resetUserToDelete } =
    useUserDelete();
  const [showUserDeleteNotification, setShowUserDeleteNotification] = useState(false);
  const [showUserDeleteInfoErrorNotification, setShowUserDeleteInfoErrorNotification] =
    useState(false);

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
      autoResetPage: false,
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          const rowOneColumn: string = row1.values[columnName];
          const rowTwoColumn: string = row2.values[columnName];
          return sortCaseInsensitive(rowOneColumn, rowTwoColumn);
        },
        array: (row1, row2, columnName) => {
          const rowOneColumnSorted: string[] = row1.values[columnName].toSorted(userRoleSorter);
          const rowTwoColumnSorted: string[] = row2.values[columnName].toSorted(userRoleSorter);
          return sort(rowOneColumnSorted.join(', '), rowTwoColumnSorted.join(', '));
        },
      },
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    // Update local state whenever any relevant user field changes. The previous implementation
    // compared only id and name, causing permission (kayttooikeustaso) changes to be ignored
    // and thus not rendered until a full page refresh. This fixes the regression by doing a
    // lightweight shallow comparison of key fields; if any differ, we replace the array.
    // Pre-sort roolit by userRoleSorter so the table's array sortType comparator
    // sees a consistent ordering without relying on mutation side effects.
    const newUsers = hankeUsers.map((u) =>
      addWholeName({ ...u, roolit: [...u.roolit].sort(userRoleSorter) }),
    );
    setUsersData((prev) => {
      if (
        prev.length === newUsers.length &&
        prev.every((u, i) => {
          const nu = newUsers[i];
          return (
            u.id === nu.id &&
            u.nimi === nu.nimi &&
            u.kayttooikeustaso === nu.kayttooikeustaso &&
            u.sahkoposti === nu.sahkoposti &&
            u.puhelinnumero === nu.puhelinnumero &&
            // Compare roles ignoring order to avoid unnecessary re-renders
            u.roolit?.length === nu.roolit?.length &&
            u.roolit
              .toSorted((a, b) => a.localeCompare(b))
              .every((r, idx) => r === nu.roolit.toSorted((a, b) => a.localeCompare(b))[idx])
          );
        })
      ) {
        return prev; // No meaningful changes
      }
      return newUsers;
    });
  }, [hankeUsers]);

  useEffect(() => {
    if (deleteInfoQueryResult.isError) {
      setShowUserDeleteInfoErrorNotification(true);
    }
  }, [deleteInfoQueryResult.isError]);

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
    // Batch react-table and HDS Table updates together to avoid nested
    // synchronous updates while keeping the operations deterministic.
    //
    // Rationale: HDS Table exposes a UI handler (`handleSort`) for its
    // internal representation while `react-table` exposes `toggleSortBy`
    // to change the sorted data. Calling these separately (or in an
    // inconsistent order) caused nested synchronous updates and a
    // "Maximum update depth exceeded" failure in tests. Batching keeps
    // both updates in the same render cycle so ordering is deterministic
    // and tests (and the UI) remain stable.
    unstable_batchedUpdates(() => {
      toggleSortBy(colKey, order === 'desc');
      handleSort();
    });
  }

  function navigateToEditUserView(id: string) {
    navigate(getEditUserPath({ hankeTunnus, id }));
  }

  const canEditUser = useCallback(
    (user: HankeUser) =>
      user.id === signedInUser?.hankeKayttajaId ||
      !!signedInUser?.kayttooikeudet.includes('MODIFY_USER'),
    [signedInUser?.hankeKayttajaId, signedInUser?.kayttooikeudet],
  );

  function handleUserDeleted(user: HankeUser) {
    queryClient.invalidateQueries(['hankeUsers', hankeTunnus]);
    setShowUserDeleteNotification(true);
    resetUserToDelete();
    if (user.id === signedInUser?.hankeKayttajaId) {
      // If user deletes themselves from hanke, show notification
      // and navigate to hanke list
      setNotification(true, {
        label: t('hankeUsers:notifications:userDeletedLabel'),
        message: t('hankeUsers:notifications:userDeletedText'),
        type: 'success',
        dismissible: true,
        closeButtonLabelText: t('common:components:notification:closeButtonLabelText'),
        autoClose: true,
        autoCloseDuration: 4000,
      });
      navigate(HANKEPORTFOLIO.path);
    }
  }

  const getUserName = useCallback(
    (args: HankeUserWithWholeName) => (
      <Flex>
        <UserIcon user={args} signedInUser={signedInUser} />
        <p>{args.nimi}</p>
      </Flex>
    ),
    [signedInUser],
  );

  const getUserRolesLabel = useCallback(
    (args: HankeUser) =>
      args.roolit
        .toSorted(userRoleSorter)
        .map((role) => t(`hankeUsers:roleLabels:${role}`))
        .join(', '),
    [t],
  );

  const getUserRoles = useCallback(
    (args: HankeUser) => <p>{getUserRolesLabel(args)}</p>,
    [getUserRolesLabel],
  );

  const getAccessRightLabel = useCallback(
    (args: HankeUser) => t(`hankeUsers:accessRightLevels:${args.kayttooikeustaso}`),
    [t],
  );

  const getActionButtons = useCallback(
    (args: HankeUser) => {
      const linkSent = linksSentTo.current.includes(args.id);
      const isSending =
        resendInvitationMutation.isLoading && resendInvitationMutation.variables === args.id;
      return (
        <Grid gridTemplateColumns="1fr 1fr 1fr" gap="var(--spacing-s)" justifyContent="flex-end">
          {!readonly && canEditUser(args) ? (
            <Link to={getEditUserPath({ hankeTunnus, id: args.id })}>
              <IconPen
                style={{ display: 'block' }}
                color="var(--color-bus)"
                aria-hidden={false}
                aria-label={t('hankeUsers:buttons:edit')}
              />
            </Link>
          ) : null}
          {!readonly && showUserDeleteButton(args, hankeUsers, signedInUser) ? (
            <button
              aria-label={t('hankeUsers:buttons:delete')}
              onClick={() => setDeletedUser(args)}
            >
              {deleteInfoQueryResult.isLoading && args.id === userToDelete?.id ? (
                <LoadingSpinner small />
              ) : (
                <IconTrash
                  style={{ display: 'block' }}
                  color="var(--color-error)"
                  aria-hidden={false}
                />
              )}
            </button>
          ) : null}
          {!args.tunnistautunut && signedInUser?.kayttooikeudet.includes('RESEND_INVITATION') ? (
            <Menu>
              <MenuButton as="button">
                {isSending ? (
                  <LoadingSpinner small />
                ) : (
                  <IconMenuDots
                    style={{ display: 'block' }}
                    color="var(--color-bus)"
                    aria-hidden={false}
                    aria-label={t('hankeUsers:labels:userMenu')}
                  />
                )}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => sendInvitation(args)} isDisabled={linkSent}>
                  <Flex alignItems="center" gap="var(--spacing-2-xs)" color="var(--color-bus)">
                    <IconEnvelope size={IconSize.ExtraSmall} />
                    {t('hankeUsers:buttons:resendInvitation')}
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </Grid>
      );
    },
    [
      readonly,
      resendInvitationMutation.isLoading,
      resendInvitationMutation.variables,
      t,
      hankeTunnus,
      getEditUserPath,
      hankeUsers,
      signedInUser,
      setDeletedUser,
      deleteInfoQueryResult.isLoading,
      userToDelete?.id,
      sendInvitation,
      linksSentTo,
      canEditUser,
    ],
  );

  // Memoize table column configuration so that HDS Table / react-table integration
  // does not receive a new 'cols' array identity on every render, which can
  // cascade into re-sorts and state updates when combined with toggleSortBy.
  const tableCols = useMemo(
    () => [
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
        headerName: '',
        key: 'actionButtons',
        isSortable: false,
        transform: getActionButtons,
      },
    ],
    [t, getUserName, getUserRoles, getAccessRightLabel, getActionButtons],
  );

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <Container>
          <MainHeading>{t('hankeUsers:userManagementTitle')}</MainHeading>
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
            // Map rows only once per render cycle; memoize to avoid creating
            // a new array reference that could contribute to unnecessary
            // downstream recalculations.
            rows={useMemo(() => page.map((row) => row.original), [page])}
            onSort={handleTableSort}
            indexKey="id"
            variant="light"
            data-testid="access-right-table"
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
                  <p>
                    <strong>{t('hankeUsers:role')}:</strong> {getUserRolesLabel(row.original)}
                  </p>
                  <p>
                    <strong>{t('hankeUsers:accessRight')}:</strong>{' '}
                    {getAccessRightLabel(row.original)}
                  </p>
                </Box>
                <Flex flexWrap="wrap" gap="var(--spacing-s)">
                  {!readonly && canEditUser(row.original) && (
                    <Button
                      iconStart={<IconPen />}
                      variant={ButtonVariant.Secondary}
                      onClick={() => navigateToEditUserView(row.original.id)}
                    >
                      {t('hankeUsers:buttons:edit')}
                    </Button>
                  )}
                  {!readonly && showUserDeleteButton(row.original, hankeUsers, signedInUser) && (
                    <Button
                      iconStart={<IconTrash />}
                      variant={ButtonVariant.Danger}
                      isLoading={
                        deleteInfoQueryResult.isLoading && row.original.id === userToDelete?.id
                      }
                      onClick={() => setDeletedUser(row.original)}
                    >
                      {t('hankeUsers:buttons:delete')}
                    </Button>
                  )}
                </Flex>
              </UserCard>
            );
          })}
          {page.length === 0 && (
            <Text tag="p" spacingTop="m" spacingBottom="s" className="heading-m">
              {t('hankeUsers:notifications:usersNotFound')}
            </Text>
          )}
        </div>

        <Box mb="var(--spacing-s)">
          <Pagination
            onChange={handleTablePageChange}
            pageHref={() => ''}
            pageCount={pageCount}
            pageIndex={pageIndex}
            paginationAriaLabel={t('common:components:paginationAriaLabel')}
          />
        </Box>

        {resendInvitationMutation.isSuccess && (
          <InvitationSuccessNotification onClose={() => resendInvitationMutation.reset()}>
            {t('hankeUsers:notifications:invitationSentSuccessText', {
              email: hankeUsers.find((user) => user.id === resendInvitationMutation.data.id)
                ?.sahkoposti,
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
            onDelete={(user) => handleUserDeleted(user)}
            deleteInfo={deleteInfoQueryResult.data}
            userToDelete={userToDelete}
          />
        )}

        {showUserDeleteNotification && (
          <UserDeleteNotification onClose={() => setShowUserDeleteNotification(false)} />
        )}

        {showUserDeleteInfoErrorNotification && (
          <UserDeleteInfoErrorNotification
            onClose={() => {
              setShowUserDeleteInfoErrorNotification(false);
              resetUserToDelete();
            }}
          />
        )}
      </Container>
    </article>
  );
}

export default AccessRightsView;
