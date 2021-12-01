import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters, useTable, usePagination, Row } from 'react-table';
import { useAccordion, Card, Select, Tag, Tabs, Tab, TabList, TabPanel } from 'hds-react';
import { IconAngleDown, IconAngleUp, IconPen, IconCrossCircle } from 'hds-react/icons';
import { Link } from 'react-router-dom';
import Text from '../../../common/components/text/Text';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { HankeDataDraft, HANKE_VAIHE } from '../../types/hanke';

import styles from './HankePortfolio.module.scss';
import { formatToFinnishDate } from '../../../common/utils/date';
import PaginationControl from '../../common/pagination/PaginationControl';

type CustomAccordionProps = {
  hanke: HankeDataDraft;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({ hanke }) => {
  const { MAP } = useLocalizedRoutes();
  // Handle accordion state with useAccordion hook
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen: false });
  // Change icon based on accordion open state
  const icon = isOpen ? <IconAngleDown size="m" /> : <IconAngleUp size="m" />;
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
            <p>{hanke.nimi}</p>
          </div>
          {/* vaihe tagit voisi olla eriväriset eri vaiheille */}
          <Tag className={styles.tag}>{hanke.vaihe}</Tag>
          <div className={styles.hankeDates}>
            <p>{formatToFinnishDate(hanke.alkuPvm)}</p>-<p>{formatToFinnishDate(hanke.loppuPvm)}</p>
          </div>
          <div className={styles.actions}>
            <IconPen />
            <IconCrossCircle />
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
          <TabList className={styles.tablist}>
            <Tab>Perustiedot</Tab>
            <Tab>Yhteystiedot</Tab>
            <Tab>Liitteet</Tab>
          </TabList>
          <TabPanel>
            <div className={styles.gridTest}>
              <div className={`${styles.gridItem} ${styles.gridDescription}`}>
                <b>Kuvaus</b>
                <p>lipsum</p>
              </div>
              <div className={styles.gridItem}>
                <b>Hankevaihe</b>
                <p>lipsum</p>
              </div>
              <div className={styles.gridItem}>
                <b>Suunnitteluvaihe</b>
                <p>lipsum</p>
              </div>
              <div className={styles.gridItem}>
                <b>Katuosoite</b>
                <p>lipsum</p>
              </div>
              <div className={styles.gridItem}>
                <b>Työmaan koko</b>
                <p>lipsum</p>
              </div>
              <div className={`${styles.gridItem} ${styles.gridType}`}>
                <b>Työmaan tyyppi</b>
                <p>lipsum</p>
              </div>
              <div className={`${styles.gridItem} ${styles.gridType}`}>
                <b>Haitat väliotsikko</b>
              </div>
              <div className={`${styles.gridItem} ${styles.gridInception}`}>
                <div className={styles.gridHaitat}>
                  <b>Kaistahaitta</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridHaitat}>
                  <b>Kaistan pituushaitta</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridHaitat}>
                  <b>Meluhaitta</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridHaitat}>
                  <b>Pölyhaitta</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridHaitat}>
                  <b>Tärinähaitta</b>
                  <p>lipsum</p>
                </div>
              </div>
              <div className={`${styles.gridItem} ${styles.gridInception}`}>
                <div className={styles.gridIndex}>
                  <b>Liikennehaitaindeksi</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridIndex}>
                  <b>Pyöräilyn pääreitti</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridIndex}>
                  <b>Merkittävät joukkoliikennereitit</b>
                  <p>lipsum</p>
                </div>
                <div className={styles.gridIndex}>
                  <b>Ruuhkautuminen</b>
                  <p>lipsum</p>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel>Tab 2 sisältö</TabPanel>
          <TabPanel>Tab 3 sisältö</TabPanel>
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
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
    useFilters,
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
    Object.keys(HANKE_VAIHE).map((hankeVaihe) =>
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

  return (
    <>
      <Select
        multiselect
        label="Hankevaiheet"
        helper="Valitse vaiheet joita haluat tarkastella"
        options={options}
        defaultValue={options}
        clearButtonAriaLabel="Clear all selections"
        // eslint-disable-next-line no-template-curly-in-string
        selectedItemRemoveButtonAriaLabel="Remove ${value}"
        onChange={updateHankeVaihe}
      />

      {page.map((row) => {
        return (
          <div key={row.original.hankeTunnus}>
            <CustomAccordion hanke={row.original} />
          </div>
        );
      })}
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

  const columns = React.useMemo(
    () => [
      {
        Header: 'hankeTunnus',
        id: 'hankeTunnus',
        accessor: 'hankeTunnus',
      },
      {
        Header: 'nimi',
        id: 'nimi',
        accessor: 'nimi',
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
      },
      {
        Header: 'loppuPvm',
        id: 'loppuPvm',
        accessor: (data: HankeDataDraft) => {
          return data.loppuPvm && Date.parse(data.loppuPvm);
        },
      },
    ],
    []
  );

  const memoizedHankkeed = React.useMemo(() => hankkeet, []);

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
          <PaginatedPortfolio data={memoizedHankkeed} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default HankePortfolio;
