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
  Tag,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TextInput,
  Fieldset,
} from 'hds-react';
import { IconAngleDown, IconAngleUp, IconPen } from 'hds-react/icons';
import { Link } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import GridItem from '../../../common/components/grid/GridItem';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { HankeDataDraft, HANKE_TYOMAATYYPPI, HANKE_VAIHE } from '../../types/hanke';
import styles from './HankePortfolio.module.scss';
import { formatToFinnishDate } from '../../../common/utils/date';
import PaginationControl from '../../common/pagination/PaginationControl';
import DateRangeControl from '../../../common/components/map/controls/DateRangeControl';
import { usePortfolioFilter } from './hooks/usePortfolioFilter';
import { hankeIsBetweenDates } from '../../map/utils';
import HankeIndexes from '../../map/components/HankeSidebar/HankeIndexes';

type CustomAccordionProps = {
  hanke: HankeDataDraft;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({ hanke }) => {
  const { MAP } = useLocalizedRoutes();
  // Handle accordion state with useAccordion hook
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen: false });
  // Change icon based on accordion open state
  const icon = isOpen ? <IconAngleDown size="m" /> : <IconAngleUp size="m" />;

  const { t } = useTranslation();
  return (
    <>
      <Card className={styles.hankeCard} border aria-label="Advanced filters" {...buttonProps}>
        {/* voi siirtää omaan palikkaan kortin headerin */}
        <div className={styles.hankeCardHeader}>
          <Link
            className={styles.link}
            to={`${MAP.path}?hanke=${hanke.hankeTunnus}`}
            title="Avaa hanke kartalla"
          >
            {hanke.hankeTunnus}
          </Link>
          <div className={styles.hankeName}>
            <Text tag="p" styleAs="body-m">
              {hanke.nimi}
            </Text>
          </div>
          {/* vaihe tagit voisi olla eriväriset eri vaiheille */}
          <Tag className={styles.tag}>{hanke.vaihe}</Tag>
          <div className={styles.hankeDates}>
            <Text tag="p" styleAs="body-m">
              {formatToFinnishDate(hanke.alkuPvm)}
            </Text>
            -
            <Text tag="p" styleAs="body-m">
              {formatToFinnishDate(hanke.loppuPvm)}
            </Text>
          </div>
          <div className={styles.actions}>
            <IconPen />
          </div>
          <div className={styles.iconWrapper}>{icon}</div>
        </div>
      </Card>
      <Card
        className={styles.hankeCardContent}
        border
        aria-label="Advanced filters"
        {...contentProps}
      >
        <Tabs small>
          <TabList>
            <Tab>{t('hankePortfolio:tabit:perustiedot')}</Tab>
            {/* 
              huom: hankkeen datarakenteessa ei ole suoraa yhteystiedot rakennetta
              vaan ovat []. Ehkäpä tämän voisi muodostaa vastaanotettaessa hankkeita?
              <Tab>{t('hankePortfolio:tabit:yhteystiedot')}</Tab> 
            */}
          </TabList>
          <TabPanel>
            <div className={styles.gridBasicInfo}>
              <GridItem
                className={`${styles.gridDescription}`}
                title={t('hankePortfolio:labels:kuvaus')}
                content={hanke.kuvaus}
              />
              <GridItem
                className={styles.gridItem}
                title={t('hankePortfolio:labels:hankeVaihe')}
                content={t(`hanke:vaihe:${hanke.vaihe}`)}
              />
              {hanke.suunnitteluVaihe && (
                <GridItem
                  className={styles.gridItem}
                  title={t('hankePortfolio:labels:suunnitteluVaihe')}
                  content={t(`hanke:suunnitteluVaihe:${hanke.suunnitteluVaihe}`)}
                />
              )}
              <div className={styles.gridItem}>
                <div className={styles.linkWrapper}>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankePortfolio:labels:katuosoite')}
                  </Text>
                  <Link
                    className={styles.link}
                    to={`${MAP.path}?hanke=${hanke.hankeTunnus}`}
                    title={t('hankePortfolio:labels:avaaKartalla')}
                  >
                    {t('hankePortfolio:labels:avaaKartalla')}
                  </Link>
                </div>
                <Text tag="p" styleAs="body-m">
                  {hanke.tyomaaKatuosoite}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:hankkeenKesto')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {formatToFinnishDate(hanke.alkuPvm)} - {formatToFinnishDate(hanke.loppuPvm)}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:tyomaanKoko')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.tyomaaKoko && t(`hanke:tyomaaKoko:${hanke.tyomaaKoko}`)}
                  {!hanke.tyomaaKoko && '-'}
                </Text>
              </div>
              <div className={`${styles.gridItem} ${styles.gridType}`}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:tyomaanTyyppi')}
                </Text>
                <div>
                  {hanke.tyomaaTyyppi &&
                    hanke.tyomaaTyyppi.length > 0 &&
                    hanke.tyomaaTyyppi.map((tyomaaTyyppi) => {
                      return (
                        <Tag className={styles.hankeTag} key={tyomaaTyyppi}>
                          {t(`hanke:tyomaaTyyppi:${tyomaaTyyppi}`)}
                        </Tag>
                      );
                    })}
                  {hanke.tyomaaTyyppi && hanke.tyomaaTyyppi.length === 0 && '-'}
                </div>
              </div>
            </div>
            <div className={styles.gridBasicInfo}>
              <div className={styles.haitatTitle}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:hankkeenHaitat')}
                </Text>
              </div>
              <div className={styles.haitatInfo}>
                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankeForm:labels:kaistaHaitta')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.kaistaHaitta && t(`hanke:kaistaHaitta:${hanke.kaistaHaitta}`)}
                    {!hanke.kaistaHaitta && '-'}
                  </Text>
                </div>

                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankeForm:labels:kaistaPituusHaitta')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.kaistaPituusHaitta &&
                      t(`hanke:kaistaPituusHaitta:${hanke.kaistaPituusHaitta}`)}
                    {!hanke.kaistaPituusHaitta && '-'}
                  </Text>
                </div>
                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankeForm:labels:meluHaitta')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.meluHaitta && t(`hanke:meluHaitta:${hanke.meluHaitta}`)}
                    {!hanke.meluHaitta && '-'}
                  </Text>
                </div>
                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankeForm:labels:polyHaitta')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.polyHaitta && t(`hanke:polyHaitta:${hanke.polyHaitta}`)}
                    {!hanke.polyHaitta && '-'}
                  </Text>
                </div>
                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankeForm:labels:tarinaHaitta')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.tarinaHaitta && t(`hanke:tarinaHaitta:${hanke.tarinaHaitta}`)}
                    {!hanke.tarinaHaitta && '-'}
                  </Text>
                </div>
              </div>
              <div className={styles.haitatIndexes}>
                <div>
                  <Text tag="h3" styleAs="h6" weight="bold">
                    {t('hankePortfolio:labels:haitanKesto')}
                  </Text>
                  <Text tag="p" styleAs="body-m">
                    {hanke.haittaAlkuPvm && formatToFinnishDate(hanke.haittaAlkuPvm)} -{' '}
                    {hanke.loppuPvm && formatToFinnishDate(hanke.loppuPvm)}
                  </Text>
                </div>
                <HankeIndexes hankeIndexData={hanke.tormaystarkasteluTulos} displayTooltip />
              </div>
            </div>
          </TabPanel>
          {/* Disabloitu toistaiseksi ennen kuin yhteyshenkilöiden tietorakenne saadaan
              paremmin sointumaan tätä näkymää varten
          <TabPanel>
            <div className={styles.gridContactInfo}>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:paatoksenHakija')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:yhteyshenkilo')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:osoite')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:sposti')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem} />
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:puhelin')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
            </div>
            <div className={styles.gridContactInfo}>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:rakennuttaja')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:yhteyshenkilo')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:osoite')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:sposti')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem} />
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:puhelin')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
            </div>
            <div className={styles.gridContactInfo}>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:tyonsuorittaja')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:yhteyshenkilo')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:nimi')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:osoite')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:sposti')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
              <div className={styles.gridItem} />
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:puhelin')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  lipsum
                </Text>
              </div>
            </div>
          </TabPanel>
          */}
        </Tabs>
      </Card>
    </>
  );
};

export type Column = {
  Header: string;
  // eslint-disable-next-line
  accessor: any;
};

export interface PagedRowsProps {
  data: Array<HankeDataDraft>;
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

  const columns: Column[] = React.useMemo(
    () => [
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
        accessor: (hanke: HankeDataDraft) => {
          return hanke.alkuPvm && Date.parse(hanke.alkuPvm);
        },
        filter: dateStartFilter,
      },
      {
        Header: 'loppuPvm',
        id: 'loppuPvm',
        accessor: (hanke: HankeDataDraft) => {
          return hanke.loppuPvm && Date.parse(hanke.loppuPvm);
        },
        filter: dateEndFilter,
      },
    ],
    []
  );
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
  }, [selectedHankeVaiheet]);

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
  }, [selectedHankeTyypit]);

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
  }, [hankeFilterStartDate]);

  useEffect(() => {
    if (hankeFilterEndDate) {
      setFilter('loppuPvm', new Date(hankeFilterEndDate).getTime());
    } else {
      setFilter('loppuPvm', null);
    }
  }, [hankeFilterEndDate]);

  return (
    <>
      <Fieldset className={styles.filters} heading={t('hankePortfolio:filters')} border>
        <TextInput
          className={styles.hankeSearch}
          id="searchHanke"
          onChange={(e) => searchHankeInputChangeDebounced(e.target.value)}
          label={t('hankePortfolio:search')}
          helperText={t('hankePortfolio:searchHelperText')}
        />
        <div>
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
          helper={t('hankePortfolio:hankevaiheetHelperText')}
          options={hankeVaiheOptions}
          defaultValue={hankeVaiheOptions}
          clearButtonAriaLabel="Clear all selections"
          // eslint-disable-next-line no-template-curly-in-string
          selectedItemRemoveButtonAriaLabel="Remove ${value}"
          onChange={updateHankeVaihe}
        />

        <Select
          className={styles.hankeTyyppi}
          multiselect
          label={t('hankePortfolio:hankkeentyyppi')}
          helper={t('hankePortfolio:hankkeentyyppiHelperText')}
          options={hankeTyyppiOptions}
          defaultValue={[]}
          clearButtonAriaLabel="Clear all selections"
          // eslint-disable-next-line no-template-curly-in-string
          selectedItemRemoveButtonAriaLabel="Remove ${value}"
          onChange={updateHankeTyyppi}
        />
        <p data-testid="numberOfFilteredRows" style={{ display: 'none' }}>
          {rows.length}
        </p>
      </Fieldset>

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
    </>
  );
};

type Props = {
  hankkeet: HankeDataDraft[];
};

const HankePortfolio: React.FC<Props> = ({ hankkeet }) => {
  const { t } = useTranslation();

  const memoizedHankkeet = React.useMemo(() => hankkeet, []);

  return (
    <div className={styles.hankesalkkuContainer}>
      <div>
        <Text
          tag="h1"
          data-testid="HankePortfolioPageHeader"
          styleAs="h2"
          spacing="s"
          weight="bold"
        >
          {t('hankePortfolio:pageHeader')}
        </Text>

        <div className={styles.contentContainer}>
          <PaginatedPortfolio data={memoizedHankkeet} />
        </div>
      </div>
    </div>
  );
};

export default HankePortfolio;
