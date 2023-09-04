import React, { useEffect, useMemo, useState } from 'react';
import { Accordion, IconAngleLeft, Pagination, SearchInput, Select, Table } from 'hds-react';
import Text from '../../../common/components/text/Text';
import { SKIP_TO_ELEMENT_ID } from '../../../common/constants/constants';
import {
  InformationViewContainer,
  InformationViewHeader,
  InformationViewMainContent,
} from '../../common/components/hankeInformationView/HankeInformationView';
import styles from './AccessRightsView.module.scss';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import { Language } from '../../../common/types/language';
import { HankeUser, AccessRightLevel } from '../hankeUsers/hankeUser';
import { $enum } from 'ts-enum-util';
import { Link } from 'react-router-dom';
import useHankeViewPath from '../hooks/useHankeViewPath';

type Props = {
  hankeUsers: HankeUser[];
  hankeTunnus: string;
  hankeName: string;
};

type AccessRightLevelOption = {
  label: string;
  value: keyof typeof AccessRightLevel;
};

const NAME_KEY = 'nimi';
const EMAIL_KEY = 'sahkoposti';
const ACCESS_RIGHT_LEVEL_KEY = 'kayttooikeustaso';

function AccessRightsView({ hankeUsers, hankeTunnus, hankeName }: Props) {
  const { t, i18n } = useTranslation();
  const hankeViewPath = useHankeViewPath(hankeTunnus);

  const columns: Column<HankeUser>[] = useMemo(() => {
    return [{ accessor: NAME_KEY }, { accessor: EMAIL_KEY }, { accessor: ACCESS_RIGHT_LEVEL_KEY }];
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
      data: hankeUsers,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  const [usersSearchValue, setUsersSearchValue] = useState('');

  const accessRightLevelOptions: AccessRightLevelOption[] = $enum(AccessRightLevel)
    .getValues()
    .map((role) => {
      return { label: t(`hankeUsers:accessRightLevels:${role}`), value: role };
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getAccessRightSelect(args: HankeUser) {
    return (
      <Select<AccessRightLevelOption>
        id="select-access-right"
        aria-labelledby={t('hankeUsers:accessRights')}
        options={accessRightLevelOptions}
        value={accessRightLevelOptions.find((option) => option.value === args.kayttooikeustaso)}
        required
      />
    );
  }

  return (
    <InformationViewContainer>
      <InformationViewHeader backgroundColor="var(--color-summer-light)">
        <Link to={hankeViewPath} className={styles.hankeLink}>
          <IconAngleLeft aria-hidden="true" />
          <Text tag="h2" styleAs="h3" weight="bold">
            {hankeName} ({hankeTunnus})
          </Text>
        </Link>
        <Text
          tag="h1"
          styleAs="h1"
          weight="bold"
          spacingBottom="l"
          id={SKIP_TO_ELEMENT_ID}
          tabIndex={-1}
        >
          {t('hankeUsers:manageRights')}
        </Text>
      </InformationViewHeader>

      <InformationViewMainContent className={styles.mainContent}>
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

        <Table
          cols={[
            {
              headerName: t('form:yhteystiedot:labels:nimi'),
              key: NAME_KEY,
              isSortable: true,
            },
            {
              headerName: t('form:yhteystiedot:labels:email'),
              key: EMAIL_KEY,
              isSortable: true,
            },
            {
              headerName: t('hankeUsers:accessRights'),
              key: ACCESS_RIGHT_LEVEL_KEY,
              transform(args: HankeUser) {
                return t(`hankeUsers:accessRightLevels:${args.kayttooikeustaso}`);
              },
              // transform: getAccessRightSelect,
            },
          ]}
          rows={page.map((row) => row.original)}
          onSort={handleTableSort}
          indexKey="id"
          variant="light"
          dataTestId="access-right-table"
        />

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
      </InformationViewMainContent>
    </InformationViewContainer>
  );
}

export default AccessRightsView;
