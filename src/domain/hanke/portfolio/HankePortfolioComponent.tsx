import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useTable,
  usePagination,
  Row,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table';
import { useAccordion, Card, Select, TextInput, Button, Pagination } from 'hds-react';
import {
  IconAngleDown,
  IconAngleUp,
  IconEye,
  IconInfoCircle,
  IconPen,
  IconSearch,
} from 'hds-react/icons';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Text from '../../../common/components/text/Text';
import { HankeData, HANKE_TYOMAATYYPPI, HANKE_VAIHE } from '../../types/hanke';
import styles from './HankePortfolio.module.scss';
import { formatToFinnishDate } from '../../../common/utils/date';
import DateRangeControl from '../../../common/components/map/controls/DateRangeControl';
import { usePortfolioFilter } from './hooks/usePortfolioFilter';
import { hankeIsBetweenDates } from '../../map/utils';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import HankeVaiheTag from '../vaiheTag/HankeVaiheTag';
import { Language } from '../../../common/types/language';
import OwnHankeMap from '../../map/components/OwnHankeMap/OwnHankeMap';
import OwnHankeMapHeader from '../../map/components/OwnHankeMap/OwnHankeMapHeader';
import HankeDraftStateNotification from '../edit/components/HankeDraftStateNotification';
import Container from '../../../common/components/container/Container';
import { SKIP_TO_ELEMENT_ID } from '../../../common/constants/constants';
import useHankeViewPath from '../hooks/useHankeViewPath';
import { useNavigateToApplicationList } from '../hooks/useNavigateToApplicationList';
import FeatureFlags from '../../../common/components/featureFlags/FeatureFlags';
import { CheckRightsByUser } from '../hankeUsers/UserRightsCheck';
import { SignedInUser, SignedInUserByHanke } from '../hankeUsers/hankeUser';
import useFocusToElement from '../../../common/hooks/useFocusToElement';

type CustomAccordionProps = {
  hanke: HankeData;
  signedInUser: SignedInUser;
  headerRef: RefObject<HTMLDivElement> | null;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({ hanke, signedInUser, headerRef }) => {
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const hankeViewPath = useHankeViewPath(hanke?.hankeTunnus);
  const navigateToApplications = useNavigateToApplicationList(hanke?.hankeTunnus);

  // Handle accordion state with useAccordion hook
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen: false });

  // Change icon based on accordion open state
  const icon = isOpen ? <IconAngleUp size="m" /> : <IconAngleDown size="m" />;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const tyomaaTyyppiContent = hanke.tyomaaTyyppi.length
    ? hanke.tyomaaTyyppi.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')
    : '-';

  function navigateToHanke() {
    navigate(hankeViewPath);
  }

  return (
    <Card className={styles.hankeCard} aria-label={hanke.nimi} border>
      <>
        <div
          className={clsx([styles.hankeCardHeader, styles.hankeCardFlexContainer])}
          {...buttonProps}
        >
          <div
            className={clsx([styles.hankeCardFlexContainer, styles.flexWrap])}
            ref={headerRef}
            tabIndex={-1}
            data-testid="hanke-card-header"
          >
            <Text tag="p" styleAs="body-m">
              {hanke.hankeTunnus}
            </Text>
            <div className={styles.hankeName}>
              <Text tag="p" styleAs="body-xl" weight="bold">
                {hanke.nimi}
              </Text>
              <FeatureFlags flags={['hanke']}>
                <HankeVaiheTag tagName={hanke.vaihe} />
              </FeatureFlags>
            </div>
            <FeatureFlags flags={['hanke']}>
              <div className={styles.hankeDates}>
                {hanke.alkuPvm && hanke.loppuPvm ? (
                  <>
                    <Text tag="p" styleAs="body-m">
                      {formatToFinnishDate(hanke.alkuPvm)}
                    </Text>
                    -
                    <Text tag="p" styleAs="body-m">
                      {formatToFinnishDate(hanke.loppuPvm)}
                    </Text>
                  </>
                ) : null}
              </div>
            </FeatureFlags>
          </div>
          <div className={styles.actions}>
            <Link
              to={hankeViewPath}
              aria-label={
                // eslint-disable-next-line
                t(`routes:${ROUTES.HANKE}.meta.title`) + ` ${hanke.nimi} - ${hanke.hankeTunnus} `
              }
              data-testid="hankeViewLink"
            >
              <IconEye aria-hidden />
            </Link>
            <FeatureFlags flags={['hanke']}>
              <CheckRightsByUser requiredRight="EDIT" signedInUser={signedInUser}>
                <Link
                  to={getEditHankePath({ hankeTunnus: hanke.hankeTunnus })}
                  aria-label={
                    // eslint-disable-next-line
                    t(`routes:${ROUTES.EDIT_HANKE}.meta.title`) +
                    ` ${hanke.nimi} - ${hanke.hankeTunnus} `
                  }
                  data-testid="hankeEditLink"
                >
                  <IconPen aria-hidden />
                </Link>
              </CheckRightsByUser>
            </FeatureFlags>
          </div>
          <button type="button" className={styles.iconWrapper}>
            {icon}
          </button>
        </div>
        <FeatureFlags flags={['hanke']}>
          <HankeDraftStateNotification hanke={hanke} className={styles.draftNotification} />
        </FeatureFlags>
      </>
      <div className={styles.hankeCardContent} {...contentProps}>
        <FeatureFlags flags={['hanke']}>
          <div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="body-m" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:kuvaus')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {hanke.kuvaus}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="body-m" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:tyomaaKatuosoite')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {hanke.tyomaaKatuosoite}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="body-m" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:alkuPvm')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {formatToFinnishDate(hanke.alkuPvm)}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="body-m" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:loppuPvm')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {formatToFinnishDate(hanke.loppuPvm)}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="body-m" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:tyomaaTyyppi')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {tyomaaTyyppiContent}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="h6" weight="bold" className={styles.infoHeader}>
                {t('hankeForm:labels:vaihe')}
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {hanke.vaihe !== null && t(`hanke:vaihe:${hanke.vaihe}`)}
              </Text>
            </div>
            <div className={styles.gridBasicInfo}>
              <Text tag="h3" styleAs="h6" weight="bold" className={styles.infoHeader}>
                Hankkeen omistaja
              </Text>
              <Text tag="p" styleAs="body-m" className={styles.infoContent}>
                {hanke.omistajat && hanke.omistajat[0]?.nimi}
              </Text>
            </div>
            <FeatureFlags flags={['hanke', 'accessRights']}>
              <div className={styles.gridBasicInfo}>
                <Text tag="h3" styleAs="h6" weight="bold" className={styles.infoHeader}>
                  {t('hankeForm:labels:rights')}
                </Text>
              </div>
            </FeatureFlags>
          </div>
          {isOpen && (
            <div>
              <OwnHankeMapHeader hankeTunnus={hanke.hankeTunnus} />
              <OwnHankeMap hanke={hanke} />
            </div>
          )}
        </FeatureFlags>

        <div>
          <Button theme="coat" className={styles.showHankeButton} onClick={navigateToHanke}>
            {t('hankePortfolio:showHankeButton')}
          </Button>
          <Button theme="coat" variant="secondary" onClick={() => navigateToApplications()}>
            {t('hankePortfolio:showApplicationsButton')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export type Column = {
  Header: string;
  // eslint-disable-next-line
  accessor: any;
};

export interface PagedRowsProps {
  hankkeet: Array<HankeData>;
  signedInUserByHanke: SignedInUserByHanke;
}

const PaginatedPortfolio: React.FC<React.PropsWithChildren<PagedRowsProps>> = ({
  hankkeet,
  signedInUserByHanke,
}) => {
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = usePortfolioFilter();

  const filterVaihe = (vaiheRows: Row[], id: string[], value: string[]) => {
    if (value.length === 0) return vaiheRows;
    return vaiheRows.filter((hanke) => value.includes(hanke.values.vaihe));
  };

  const filterTyyppi = (tyyppiRows: Row[], id: string[], value: string[]) => {
    if (value.length === 0) return tyyppiRows;
    return tyyppiRows.filter((hanke) => {
      const includedTyypit = hanke.values.tyomaaTyyppi.filter((tyyppi: string) =>
        value.includes(tyyppi),
      );
      return includedTyypit.length > 0;
    });
  };

  const columns: Column[] = React.useMemo(() => {
    const dateStartFilter = (dateStartRows: Row[], id: string[], dateStart: string) => {
      if (dateStart) {
        if (hankeFilterEndDate) {
          return dateStartRows.filter((hanke) =>
            hankeIsBetweenDates({ startDate: dateStart, endDate: hankeFilterEndDate })({
              startDate: hanke.values.alkuPvm,
              endDate: hanke.values.loppuPvm,
            }),
          );
        }
        return dateStartRows.filter((hanke) => dateStart <= hanke.values.loppuPvm);
      }
      return dateStartRows;
    };

    const dateEndFilter = (dateEndRows: Row[], id: string[], dateEnd: string) => {
      if (dateEnd) {
        if (hankeFilterStartDate) {
          return dateEndRows.filter((hanke) =>
            hankeIsBetweenDates({ startDate: hankeFilterStartDate, endDate: dateEnd })({
              startDate: hanke.values.alkuPvm,
              endDate: hanke.values.loppuPvm,
            }),
          );
        }
        return dateEndRows.filter((hanke) => hanke.values.alkuPvm <= dateEnd);
      }
      return dateEndRows;
    };

    return [
      {
        Header: 'hankeTunnus',
        id: 'hankeTunnus',
        accessor: 'hankeTunnus',
        defaultCanFilter: true,
      },
      {
        Header: 'nimi',
        id: 'nimi',
        accessor: 'nimi',
        defaultCanFilter: true,
      },
      {
        Header: 'vaihe',
        id: 'vaihe',
        accessor: 'vaihe',
        filter: filterVaihe,
      },
      {
        Header: 'tyomaaTyyppi',
        id: 'tyomaaTyyppi',
        accessor: 'tyomaaTyyppi',
        filter: filterTyyppi,
      },
      {
        Header: 'alkuPvm',
        id: 'alkuPvm',
        accessor: (hanke: HankeData) => {
          return hanke.alkuPvm && Date.parse(hanke.alkuPvm);
        },
        filter: dateStartFilter,
      },
      {
        Header: 'loppuPvm',
        id: 'loppuPvm',
        accessor: (hanke: HankeData) => {
          return hanke.loppuPvm && Date.parse(hanke.loppuPvm);
        },
        filter: dateEndFilter,
      },
    ];
  }, [hankeFilterStartDate, hankeFilterEndDate]);

  const {
    page,
    gotoPage,
    pageCount,
    state: { pageIndex, filters, globalFilter },
    setFilter,
    setGlobalFilter,
    rows,
    preFilteredRows,
  } = useTable(
    {
      columns,
      data: hankkeet,
      initialState: {
        pageSize: 10,
        sortBy: useMemo(() => [{ id: 'alkuPvm', desc: false }], []),
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { t, i18n } = useTranslation();

  const [selectedHankeVaiheet, setSelectedHankeVaiheet] = useState<string[]>([]);

  // Initial setup for hankevaihe <Select /> options on first render
  // Using any: <Select /> component of HDS typing seems incorrect.
  // Would require OptionType[][] although the component takes in OptionType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hankeVaiheOptions: any = Object.keys(HANKE_VAIHE).map((hankeVaihe) => ({
    label: t(`hanke:vaihe:${hankeVaihe}`),
    value: hankeVaihe,
  }));

  // Using any: <Select /> component of HDS typing seems incorrect.
  // Would require OptionType[][] although the component takes in OptionType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateHankeVaihe = (changedHankeVaiheet: any[]) =>
    setSelectedHankeVaiheet(changedHankeVaiheet.map((hankeVaihe) => hankeVaihe.value));

  useEffect(() => {
    setFilter('vaihe', selectedHankeVaiheet);
  }, [selectedHankeVaiheet, setFilter]);

  const [selectedHankeTyypit, setSelectedHankeTyypit] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hankeTyyppiOptions: any = Object.keys(HANKE_TYOMAATYYPPI).map((hankeTyyppi) => ({
    label: t(`hanke:tyomaaTyyppi:${hankeTyyppi}`),
    value: hankeTyyppi,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateHankeTyyppi = (changedHankeTyypit: any[]) =>
    setSelectedHankeTyypit(changedHankeTyypit.map((hankeTyyppi) => hankeTyyppi.value));

  useEffect(() => {
    setFilter('tyomaaTyyppi', selectedHankeTyypit);
  }, [selectedHankeTyypit, setFilter]);

  const [hankeSearchValue, setHankeSearchValue] = useState('');

  const searchHankeInputChange = (searchInput: string) => {
    const filter = searchInput && searchInput.length > 0 ? searchInput : undefined;
    setGlobalFilter(filter);
  };

  const searchHankeInputChangeDebounced = useAsyncDebounce((e) => {
    searchHankeInputChange(e);
  }, 200);

  useEffect(() => {
    searchHankeInputChangeDebounced(hankeSearchValue);
  }, [hankeSearchValue, searchHankeInputChangeDebounced]);

  useEffect(() => {
    if (hankeFilterStartDate) {
      setFilter('alkuPvm', new Date(hankeFilterStartDate).getTime());
    } else {
      setFilter('alkuPvm', null);
    }
  }, [hankeFilterStartDate, setFilter]);

  useEffect(() => {
    if (hankeFilterEndDate) {
      setFilter('loppuPvm', new Date(hankeFilterEndDate).getTime());
    } else {
      setFilter('loppuPvm', null);
    }
  }, [hankeFilterEndDate, setFilter]);

  const [isFiltered, setIsFiltered] = useState(false);

  const resetFilters = () => {
    setHankeSearchValue('');
    setHankeFilterStartDate(null);
    setHankeFilterEndDate(null);
    updateHankeVaihe([]);
    updateHankeTyyppi([]);
  };

  useEffect(() => {
    const areFilters = filters.some((filter) => {
      const { value } = filter;
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null;
    });

    setIsFiltered(Boolean(globalFilter) || areFilters);
  }, [setIsFiltered, filters, globalFilter]);

  const firstHankeCardRef = useFocusToElement<HTMLDivElement>(pageIndex);

  function handlePageChange(e: React.MouseEvent, index: number) {
    e.preventDefault();
    gotoPage(index);
  }

  return (
    <>
      <div className={styles.headerContainer}>
        <Container>
          <Text
            tag="h1"
            data-testid="HankePortfolioPageHeader"
            styleAs="h1"
            spacingBottom="s"
            weight="bold"
            id={SKIP_TO_ELEMENT_ID}
            tabIndex={-1}
          >
            {t('hankePortfolio:pageHeader')}
          </Text>

          <div
            className={styles.filters}
            aria-label={t('hankePortfolio:filters')}
            aria-describedby={t('hankePortfolio:filtersInfoText')}
          >
            <TextInput
              className={styles.hankeSearch}
              id="searchHanke"
              value={hankeSearchValue}
              onChange={(e) => setHankeSearchValue(e.target.value)}
              label={t('hankePortfolio:search')}
            />
            <FeatureFlags flags={['hanke']}>
              <div className={styles.dateRange}>
                <DateRangeControl
                  startDate={hankeFilterStartDate}
                  endDate={hankeFilterEndDate}
                  updateStartDate={setHankeFilterStartDate}
                  updateEndDate={setHankeFilterEndDate}
                />
              </div>

              <Select
                className={styles.hankeVaihe}
                multiselect
                label={t('hankePortfolio:hankevaiheet')}
                options={hankeVaiheOptions}
                defaultValue={[]}
                clearButtonAriaLabel={
                  // eslint-disable-next-line prefer-template
                  t('common:components:multiselect:clear') + ' ' + t('hankePortfolio:hankevaiheet')
                }
                // eslint-disable-next-line no-template-curly-in-string
                selectedItemRemoveButtonAriaLabel="Remove {value}"
                onChange={updateHankeVaihe}
                value={
                  selectedHankeVaiheet.map((hankeVaihe) => ({
                    label: t(`hanke:vaihe:${hankeVaihe}`),
                    value: hankeVaihe,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  })) as any
                }
              />

              <Select
                className={styles.hankeTyyppi}
                multiselect
                label={t('hankeForm:labels:tyomaaTyyppi')}
                options={hankeTyyppiOptions}
                defaultValue={[]}
                clearButtonAriaLabel={
                  // eslint-disable-next-line prefer-template
                  t('common:components:multiselect:clear') +
                  ' ' +
                  t('hankeForm:labels:tyomaaTyyppi')
                }
                // eslint-disable-next-line no-template-curly-in-string
                selectedItemRemoveButtonAriaLabel="Remove {value}"
                onChange={updateHankeTyyppi}
                value={
                  selectedHankeTyypit.map((hankeTyyppi) => ({
                    label: t(`hanke:tyomaaTyyppi:${hankeTyyppi}`),
                    value: hankeTyyppi,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  })) as any
                }
              />
            </FeatureFlags>

            <p data-testid="numberOfFilteredRows" style={{ display: 'none' }}>
              {rows.length}
            </p>
          </div>

          <button
            className={clsx(styles.clearFiltersButton, {
              [styles.clearFiltersButton__hidden]: !isFiltered,
            })}
            type="button"
            onClick={resetFilters}
          >
            {t('hankePortfolio:clearFiltersButton')}
          </button>
          <div className={styles.filtersInfoText} aria-hidden>
            <div className={styles.icon}>
              <IconInfoCircle size="xs" color="var(--color-black-60)" />
            </div>
            <p>{t('hankePortfolio:filtersInfoText')}</p>
          </div>
        </Container>
      </div>

      <div className={styles.contentContainer}>
        <Container>
          <div>
            <Text tag="p" styleAs="h3" weight="bold" spacingBottom="m">
              {t('hankePortfolio:searchResults', { count: rows.length })}
            </Text>

            {rows.length > 0 &&
              page.map(({ original: hanke }, index) => {
                const { hankeTunnus } = hanke;
                const signedInUser = signedInUserByHanke[hankeTunnus];
                return (
                  <CustomAccordion
                    key={hankeTunnus}
                    hanke={hanke}
                    signedInUser={signedInUser}
                    headerRef={index === 0 ? firstHankeCardRef : null}
                  />
                );
              })}
            {rows.length === 0 && preFilteredRows.length > 0 && (
              <div className={styles.notFoundContainer}>
                <IconSearch size="l" />
                <Text tag="p" styleAs="h3" weight="bold" spacingTop="m">
                  {t('hankePortfolio:noneFound')}
                </Text>
              </div>
            )}
            {preFilteredRows.length === 0 && (
              <div className={styles.notFoundContainer}>
                <Text tag="p" styleAs="h3" weight="bold" spacingTop="m">
                  {t('hankePortfolio:noneExist')}
                </Text>
              </div>
            )}

            {rows.length > 0 && (
              <div className={styles.pagination}>
                <Pagination
                  language={i18n.language as Language}
                  onChange={handlePageChange}
                  pageHref={() => ''}
                  pageCount={pageCount}
                  pageIndex={pageIndex}
                  paginationAriaLabel={t('hankeList:paginatioAriaLabel')}
                />
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

type Props = {
  hankkeet: HankeData[];
  signedInUserByHanke: SignedInUserByHanke;
};

const HankePortfolio: React.FC<React.PropsWithChildren<Props>> = ({
  hankkeet,
  signedInUserByHanke,
}) => {
  return (
    <div className={styles.hankesalkkuContainer}>
      <PaginatedPortfolio hankkeet={hankkeet} signedInUserByHanke={signedInUserByHanke} />
    </div>
  );
};

export default HankePortfolio;
