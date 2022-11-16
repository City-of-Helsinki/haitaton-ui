import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useTable,
  usePagination,
  Row,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import {
  useAccordion,
  Card,
  Select,
  TextInput,
  Link as HdsLink,
  Button,
  Notification,
} from 'hds-react';
import {
  IconAngleDown,
  IconAngleUp,
  IconEye,
  IconLinkExternal,
  IconLocation,
  IconPen,
} from 'hds-react/icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Text from '../../../common/components/text/Text';
import { HankeData, HANKE_TYOMAATYYPPI, HANKE_VAIHE } from '../../types/hanke';
import styles from './HankePortfolio.module.scss';
import { formatToFinnishDate } from '../../../common/utils/date';
import PaginationControl from '../../common/pagination/PaginationControl';
import DateRangeControl from '../../../common/components/map/controls/DateRangeControl';
import { usePortfolioFilter } from './hooks/usePortfolioFilter';
import { hankeIsBetweenDates } from '../../map/utils';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';
import HankeVaiheTag from '../vaiheTag/HankeVaiheTag';
import Map from '../../../common/components/map/Map';
import Kantakartta from '../../map/components/Layers/Kantakartta';
import OverviewMapControl from '../../../common/components/map/controls/OverviewMapControl';
import { hankeSchema } from '../edit/hankeSchema';

type CustomAccordionProps = {
  hanke: HankeData;
};

/**
 * Check if hanke data matches hanke schema
 */
function useIsHankeValid(hanke: HankeData) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    hankeSchema.isValid(hanke).then((valid) => {
      setIsValid(valid);
    });
  }, [hanke]);

  return isValid;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({ hanke }) => {
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const getFullPageMapPath = useLinkPath(ROUTES.FULL_PAGE_MAP);
  // Handle accordion state with useAccordion hook
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen: false });
  // Change icon based on accordion open state
  const icon = isOpen ? <IconAngleDown size="m" /> : <IconAngleUp size="m" />;

  // Check if hanke has all the required fields filled
  const isHankeValid = useIsHankeValid(hanke);

  const { t } = useTranslation();

  const tyomaaTyyppiContent = hanke.tyomaaTyyppi.length
    ? hanke.tyomaaTyyppi.map((tyyppi) => t(`hanke:tyomaaTyyppi:${tyyppi}`)).join(', ')
    : '-';

  return (
    <Card className={styles.hankeCard} border>
      <>
        <div
          className={clsx([styles.hankeCardHeader, styles.hankeCardFlexContainer])}
          {...buttonProps}
        >
          <div className={clsx([styles.hankeCardFlexContainer, styles.flexWrap])}>
            <Text tag="p" styleAs="body-m">
              {hanke.hankeTunnus}
            </Text>
            <div className={styles.hankeName}>
              <Text tag="p" styleAs="body-xl" weight="bold">
                {hanke.nimi}
              </Text>
              <HankeVaiheTag tagName={hanke.vaihe}>{hanke.vaihe}</HankeVaiheTag>
            </div>
            <div className={styles.hankeDates}>
              <Text tag="p" styleAs="body-m">
                {formatToFinnishDate(hanke.alkuPvm)}
              </Text>
              -
              <Text tag="p" styleAs="body-m">
                {formatToFinnishDate(hanke.loppuPvm)}
              </Text>
            </div>
          </div>
          <div className={styles.actions}>
            <Link to="/" data-testid="hankeViewLink">
              <IconEye aria-hidden />
            </Link>
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
          </div>
          <div className={styles.iconWrapper}>{icon}</div>
        </div>
        {!isHankeValid && (
          <Notification
            size="small"
            label={t('hankePortfolio:draftStateLabel')}
            className={styles.notification}
            type="alert"
          >
            {t('hankePortfolio:draftState')}
          </Notification>
        )}
      </>
      <div className={styles.hankeCardContent} {...contentProps}>
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
              {t(`hanke:vaihe:${hanke.vaihe}`)}
            </Text>
          </div>
          <div className={styles.gridBasicInfo}>
            <Text tag="h3" styleAs="h6" weight="bold" className={styles.infoHeader}>
              Hankkeen omistaja
            </Text>
          </div>
          <div className={styles.gridBasicInfo}>
            <Text tag="h3" styleAs="h6" weight="bold" className={styles.infoHeader}>
              {t('hankeForm:labels:rights')}
            </Text>
          </div>
        </div>
        {isOpen && (
          <div>
            <div className={styles.mapHeader}>
              <div className={styles.mapHeader__inner}>
                <IconLocation />
                <Text tag="h3" styleAs="h4" weight="bold">
                  {t('hankePortfolio:areaLocation')}
                </Text>
              </div>
              <div>
                <HdsLink href={getFullPageMapPath({ hankeTunnus: hanke.hankeTunnus })} openInNewTab>
                  {t('hankePortfolio:openMapToNewWindow')}
                </HdsLink>
                <IconLinkExternal size="xs" />
              </div>
            </div>
            <div className={styles.mapContainer}>
              <Map zoom={9} mapClassName={styles.mapContainer__inner} showAttribution={false}>
                <Kantakartta />
                <OverviewMapControl className={styles.overviewMap} />
              </Map>
            </div>
          </div>
        )}

        <div>
          <Button theme="coat" className={styles.showHankeButton}>
            {t('hankePortfolio:showHankeButton')}
          </Button>
          <Button theme="coat" variant="secondary">
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
  data: Array<HankeData>;
}

const PaginatedPortfolio: React.FC<PagedRowsProps> = ({ data }) => {
  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = usePortfolioFilter();

  const filterVaihe = (vaiheRows: Row[], id: string[], value: string[]) =>
    vaiheRows.filter((hanke) => value.includes(hanke.values.vaihe));

  const filterTyyppi = (tyyppiRows: Row[], id: string[], value: string[]) => {
    if (value.length === 0) return tyyppiRows;
    return tyyppiRows.filter((hanke) => {
      const includedTyypit = hanke.values.tyomaaTyyppi.filter((tyyppi: string) =>
        value.includes(tyyppi)
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
            })
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
            })
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
    canNextPage,
    canPreviousPage,
    page,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    pageOptions,
    state: { pageIndex },
    setFilter,
    setGlobalFilter,
    rows,
    preFilteredRows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const { t } = useTranslation();

  const [selectedHankeVaiheet, setSelectedHankeVaiheet] = useState(Object.keys(HANKE_VAIHE));

  // Initial setup for hankevaihe <Select /> options on first render
  // Using any: <Select /> component of HDS typing seems incorrect.
  // Would require OptionType[][] although the component takes in OptionType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hankeVaiheOptions: any = [];

  useEffect(() => {
    Object.keys(HANKE_VAIHE).forEach((hankeVaihe) =>
      hankeVaiheOptions.push({ label: t(`hanke:vaihe:${hankeVaihe}`), value: hankeVaihe })
    );
  });

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
  const hankeTyyppiOptions: any = [];

  useEffect(() => {
    Object.keys(HANKE_TYOMAATYYPPI).forEach((hankeTyyppi) =>
      hankeTyyppiOptions.push({
        label: t(`hanke:tyomaaTyyppi:${hankeTyyppi}`),
        value: hankeTyyppi,
      })
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateHankeTyyppi = (changedHankeTyypit: any[]) =>
    setSelectedHankeTyypit(changedHankeTyypit.map((hankeTyyppi) => hankeTyyppi.value));

  useEffect(() => {
    setFilter('tyomaaTyyppi', selectedHankeTyypit);
  }, [selectedHankeTyypit, setFilter]);

  const searchHankeInputChange = (searchInput: string) => {
    const filter = searchInput && searchInput.length > 0 ? searchInput : undefined;
    setGlobalFilter(filter);
  };

  const searchHankeInputChangeDebounced = useAsyncDebounce((e) => {
    searchHankeInputChange(e);
  }, 200);

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

  return (
    <>
      <div className={styles.headerContainer}>
        <Text
          tag="h1"
          data-testid="HankePortfolioPageHeader"
          styleAs="h1"
          spacingBottom="s"
          weight="bold"
        >
          {t('hankePortfolio:pageHeader')}
        </Text>

        <div className={styles.filters}>
          <TextInput
            className={styles.hankeSearch}
            id="searchHanke"
            onChange={(e) => searchHankeInputChangeDebounced(e.target.value)}
            label={t('hankePortfolio:search')}
          />
          <div>
            <div className={styles.dateRange}>
              <DateRangeControl
                startDate={hankeFilterStartDate}
                endDate={hankeFilterEndDate}
                updateStartDate={setHankeFilterStartDate}
                updateEndDate={setHankeFilterEndDate}
              />
            </div>
          </div>

          <Select
            className={styles.hankeVaihe}
            multiselect
            label={t('hankePortfolio:hankevaiheet')}
            options={hankeVaiheOptions}
            defaultValue={hankeVaiheOptions}
            clearButtonAriaLabel={
              // eslint-disable-next-line prefer-template
              t('common:components:multiselect:clear') + ' ' + t('hankePortfolio:hankevaiheet')
            }
            // eslint-disable-next-line no-template-curly-in-string
            selectedItemRemoveButtonAriaLabel="Remove {value}"
            onChange={updateHankeVaihe}
          />

          <Select
            className={styles.hankeTyyppi}
            multiselect
            label={t('hankeForm:labels:tyomaaTyyppi')}
            options={hankeTyyppiOptions}
            defaultValue={[]}
            clearButtonAriaLabel={
              // eslint-disable-next-line prefer-template
              t('common:components:multiselect:clear') + ' ' + t('hankeForm:labels:tyomaaTyyppi')
            }
            // eslint-disable-next-line no-template-curly-in-string
            selectedItemRemoveButtonAriaLabel="Remove {value}"
            onChange={updateHankeTyyppi}
          />
          <p data-testid="numberOfFilteredRows" style={{ display: 'none' }}>
            {rows.length}
          </p>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <div>
          <Text tag="p" styleAs="h3" weight="bold" spacingBottom="m">
            {t('hankePortfolio:searchResults', { count: rows.length })}
          </Text>

          {rows.length > 0 &&
            page.map((row) => {
              return (
                <div key={row.original.hankeTunnus}>
                  <CustomAccordion hanke={row.original} />
                </div>
              );
            })}
          {rows.length === 0 && preFilteredRows.length > 0 && (
            <div>{t('hankePortfolio:noneFound')}</div>
          )}
          {preFilteredRows.length === 0 && <div>{t('hankePortfolio:noneExist')}</div>}
          <PaginationControl
            goToPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pagesLength={pageOptions.length}
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
          />
        </div>
      </div>
    </>
  );
};

type Props = {
  hankkeet: HankeData[];
};

const HankePortfolio: React.FC<Props> = ({ hankkeet }) => {
  return (
    <div className={styles.hankesalkkuContainer}>
      <PaginatedPortfolio data={hankkeet} />
    </div>
  );
};

export default HankePortfolio;
