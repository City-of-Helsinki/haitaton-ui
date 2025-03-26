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
  IconPen,
  Button,
  IconTrash,
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
            ariaHidden={false}
            ariaLabel={t('hankeUsers:labels:ownInformation')}
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
            ariaHidden={false}
            ariaLabel={t('hankeUsers:labels:userIdentified')}
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
            ariaHidden={false}
            ariaLabel={t('hankeUsers:labels:invitationSent', {
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
  hankeName: string;
  signedInUser?: SignedInUser;
};

function AccessRightsView({ hankeUsers, hankeTunnus, hankeName, signedInUser }: Readonly<Props>) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { HANKEPORTFOLIO } = useLocalizedRoutes();
  const queryClient = useQueryClient();
  const hankeViewPath = useHankeViewPath(hankeTunnus);
  const getEditUserPath = useLinkPath(ROUTES.EDIT_USER);
  const { setNotification } = useGlobalNotification();
  const [usersData, setUsersData] = useState<HankeUserWithWholeName[]>(() =>
    hankeUsers.map(addWholeName),
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
    setUsersData(hankeUsers.map(addWholeName));
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

  function getUserName(args: HankeUserWithWholeName) {
    return (
      <Flex>
        <UserIcon user={args} signedInUser={signedInUser} />
        <p>{args.nimi}</p>
      </Flex>
    );
  }

  function getUserRolesLabel(args: HankeUser) {
    return args.roolit
      .sort(userRoleSorter)
      .map((role) => t(`hankeUsers:roleLabels:${role}`))
      .join(', ');
  }

  function getUserRoles(args: HankeUser) {
    return <p>{getUserRolesLabel(args)}</p>;
  }

  function getAccessRightLabel(args: HankeUser) {
    return t(`hankeUsers:accessRightLevels:${args.kayttooikeustaso}`);
  }

  function getActionButtons(args: HankeUser) {
    const linkSent = linksSentTo.current.includes(args.id);
    const isSending =
      resendInvitationMutation.isLoading && resendInvitationMutation.variables === args.id;

    return (
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap="var(--spacing-s)" justifyContent="flex-end">
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
        {showUserDeleteButton(args, hankeUsers, signedInUser) ? (
          <button aria-label={t('hankeUsers:buttons:delete')} onClick={() => setDeletedUser(args)}>
            {deleteInfoQueryResult.isLoading && args.id === userToDelete?.id ? (
              <LoadingSpinner small />
            ) : (
              <IconTrash
                style={{ display: 'block' }}
                color="var(--color-error)"
                ariaHidden={false}
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
      headerName: '',
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
              ariaLabel={t('hankePortfolio:ariaLabels:breadcrumb:ariaLabel')}
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
                  <p>
                    <strong>{t('hankeUsers:role')}:</strong> {getUserRolesLabel(row.original)}
                  </p>
                  <p>
                    <strong>{t('hankeUsers:accessRight')}:</strong>{' '}
                    {getAccessRightLabel(row.original)}
                  </p>
                </Box>
                <Flex flexWrap="wrap" gap="var(--spacing-s)">
                  {canEditUser(row.original) && (
                    <Button
                      iconLeft={<IconPen />}
                      variant="secondary"
                      onClick={() => navigateToEditUserView(row.original.id)}
                    >
                      {t('hankeUsers:buttons:edit')}
                    </Button>
                  )}
                  {showUserDeleteButton(row.original, hankeUsers, signedInUser) && (
                    <Button
                      iconLeft={<IconTrash />}
                      variant="danger"
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

        <div className={styles.pagination}>
          <Pagination
            language={i18n.language as Language}
            onChange={handleTablePageChange}
            pageHref={() => ''}
            pageCount={pageCount}
            pageIndex={pageIndex}
            paginationAriaLabel={t('common:components:paginationAriaLabel')}
          />
        </div>

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
