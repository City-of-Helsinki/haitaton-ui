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
import { HankeDataDraft, HANKE_VAIHE } from '../../types/hanke';
import styles from './HankePortfolio.module.scss';
import { formatToFinnishDate } from '../../../common/utils/date';
import PaginationControl from '../../common/pagination/PaginationControl';
import DateRangeControl from '../../../common/components/map/controls/DateRangeControl';
import { usePortfolioFilter } from './hooks/usePortfolioFilter';

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
                className={`${styles.gridItem} ${styles.gridDescription}`}
                title={t('hankePortfolio:labels:hankeVaihe')}
                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque consectetur mauris augue, at dignissim magna pharetra at. Nulla mollis mattis suscipit. Maecenas sodales in leo et commodo. Donec hendrerit lacinia mi. Sed feugiat justo tempor, vulputate nulla ut, vestibulum mauris. Aliquam eget ante nec turpis aliquam bibendum sed et ex. Sed fermentum ante eros, quis scelerisque libero facilisis ac."
              />
              <GridItem
                className={styles.gridItem}
                title={t('hankePortfolio:labels:kuvaus')}
                content={hanke.kuvaus}
              />
              <GridItem
                className={styles.gridItem}
                title={t('hankePortfolio:labels:suunnitteluVaihe')}
                content={t(`hanke:vaihe:${hanke.vaihe}`)}
              />
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
                        <Tag className={styles.hankeTag}>
                          {t(`hanke:tyomaaTyyppi:${tyomaaTyyppi}`)}
                        </Tag>
                      );
                    })}
                  {hanke.tyomaaTyyppi && hanke.tyomaaTyyppi.length === 0 && '-'}
                </div>
              </div>
            </div>
            <div className={styles.gridBasicInfo}>
              <div className={`${styles.gridItem} ${styles.gridType}`}>
                <Text tag="h3" styleAs="h5" weight="bold">
                  {t('hankePortfolio:labels:hankkeenHaitat')}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeForm:labels:kaistaHaitta')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.kaistaHaitta && t(`hanke:kaistaHaitta:${hanke.kaistaHaitta}`)}
                  {!hanke.kaistaHaitta && '-'}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankePortfolio:labels:haitanKesto')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.haittaAlkuPvm && formatToFinnishDate(hanke.haittaAlkuPvm)} -{' '}
                  {hanke.loppuPvm && formatToFinnishDate(hanke.loppuPvm)}
                </Text>
              </div>
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeForm:labels:kaistaPituusHaitta')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.kaistaPituusHaitta &&
                    t(`hanke:kaistaPituusHaitta:${hanke.kaistaPituusHaitta}`)}
                  {!hanke.kaistaPituusHaitta && '-'}
                </Text>
              </div>

              {/*
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeIndexes:liikennehaittaindeksi')}
                </Text>
                <div className={styles.index}>
                  <div className={styles.indexBox}>4</div>
                </div>
              </div>
              */}
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeForm:labels:meluHaitta')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.meluHaitta && t(`hanke:meluHaitta:${hanke.meluHaitta}`)}
                  {!hanke.meluHaitta && '-'}
                </Text>
              </div>
              {/*
                  huom: indeksit - ovat [] eikä suoraan voida accessoida avaimella.
                  Katso referenssi kartalta avautuvasta tabista
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeIndexes:pyorailynPaareitti')}
                </Text>

                <div className={styles.index}>
                  <div className={styles.indexBox}>5</div>
                  <Text tag="p" styleAs="body-m">
                    {t('hankeIndexes:kiertoreittitarve')}:{' '}
                    {t('hankeIndexes:KIERTOREITTITARPEET:TODENNAKOINEN')}
                  </Text>
                </div>
              
              </div>
              */}
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeForm:labels:polyHaitta')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.polyHaitta && t(`hanke:polyHaitta:${hanke.polyHaitta}`)}
                  {!hanke.polyHaitta && '-'}
                </Text>
              </div>

              {/*
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeIndexes:merkittavatJoukkoliikennereitit')}
                </Text>
                <div className={styles.index}>
                  <div className={styles.indexBox}>4</div>
                  <Text tag="p" styleAs="body-m">
                    {t('hankeIndexes:kiertoreittitarve')}:{' '}
                    {t('hankeIndexes:KIERTOREITTITARPEET:MERKITTAVA')}
                  </Text>
                </div>
                
              </div>
              */}
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeForm:labels:tarinaHaitta')}
                </Text>
                <Text tag="p" styleAs="body-m">
                  {hanke.tarinaHaitta && t(`hanke:tarinaHaitta:${hanke.tarinaHaitta}`)}
                  {!hanke.tarinaHaitta && '-'}
                </Text>
              </div>
              {/*
              <div className={styles.gridItem}>
                <Text tag="h3" styleAs="h6" weight="bold">
                  {t('hankeIndexes:ruuhkautuminen')}
                </Text>
                <div className={styles.index}>
                  <div className={styles.indexBox}>3</div>
                  <Text tag="p" styleAs="body-m">
                    {t('hankeIndexes:kiertoreittitarve')}:{' '}
                    {t('hankeIndexes:KIERTOREITTITARPEET:EI_TARVETTA')}
                  </Text>
                </div>
              </div>
              */}
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
  columns: Array<Column>;
  data: Array<HankeDataDraft>;
}

const PaginatedPortfolio: React.FC<PagedRowsProps> = ({ columns, data }) => {
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
  const options: any = [];
  useEffect(() => {
    Object.keys(HANKE_VAIHE).forEach((hankeVaihe) =>
      options.push({ label: t(`hanke:vaihe:${hankeVaihe}`), value: hankeVaihe })
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

  const searchHankeInputChange = (searchInput: string) => {
    const filter = searchInput && searchInput.length > 0 ? searchInput : undefined;
    setGlobalFilter(filter);
  };

  const searchHankeInputChangeDebounced = useAsyncDebounce((e) => {
    searchHankeInputChange(e);
  }, 200);

  const {
    hankeFilterStartDate,
    hankeFilterEndDate,
    setHankeFilterStartDate,
    setHankeFilterEndDate,
  } = usePortfolioFilter();

  useEffect(() => {
    setFilter('alkuPvm', new Date(hankeFilterStartDate).getTime());
  }, [hankeFilterStartDate]);

  useEffect(() => {
    setFilter('loppuPvm', new Date(hankeFilterEndDate).getTime());
  }, [hankeFilterEndDate]);

  return (
    <>
      <Fieldset heading={t('hankePortfolio:filters')} border>
        <TextInput
          id="searchHanke"
          onChange={(e) => searchHankeInputChangeDebounced(e.target.value)}
          label={t('hankePortfolio:search')}
          helperText={t('hankePortfolio:searchHelperText')}
        />
        <div style={{ display: 'none' }}>
          <DateRangeControl
            startDate={hankeFilterStartDate}
            endDate={hankeFilterEndDate}
            updateStartDate={setHankeFilterStartDate}
            updateEndDate={setHankeFilterEndDate}
          />
        </div>

        <Select
          multiselect
          label={t('hankePortfolio:hankevaiheet')}
          helper={t('hankePortfolio:hankevaiheetHelperText')}
          options={options}
          defaultValue={options}
          clearButtonAriaLabel="Clear all selections"
          // eslint-disable-next-line no-template-curly-in-string
          selectedItemRemoveButtonAriaLabel="Remove ${value}"
          onChange={updateHankeVaihe}
        />
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

  const filterVaihe = (rows: Row[], id: string[], value: string[]) =>
    rows.filter((hanke) => value.includes(hanke.values.vaihe));

  const dateStartFilter = (rows: Row[], id: string[], dateStart: string) =>
    rows.filter((hanke) => dateStart <= hanke.values.alkuPvm);

  const dateEndFilter = (rows: Row[], id: string[], dateEnd: string) =>
    rows.filter((hanke) => dateEnd >= hanke.values.loppuPvm);

  const columns = React.useMemo(
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
        Header: 'alkuPvm',
        id: 'alkuPvm',
        accessor: (data: HankeDataDraft) => {
          return data.alkuPvm && Date.parse(data.alkuPvm);
        },
        filter: dateStartFilter,
      },
      {
        Header: 'loppuPvm',
        id: 'loppuPvm',
        accessor: (data: HankeDataDraft) => {
          return data.loppuPvm && Date.parse(data.loppuPvm);
        },
        filter: dateEndFilter,
      },
    ],
    []
  );

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
          <PaginatedPortfolio data={memoizedHankkeet} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default HankePortfolio;
