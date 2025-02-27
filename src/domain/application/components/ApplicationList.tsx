import React from 'react';
import { Box } from '@chakra-ui/react';
import { useTable, Column, usePagination, useSortBy } from 'react-table';
import { Pagination } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { HankkeenHakemus } from '../types/application';
import ApplicationListItem from './ApplicationListItem';
import { Language } from '../../../common/types/language';
import styles from './ApplicationList.module.scss';

type Props = {
  hankeTunnus: string;
  applications: HankkeenHakemus[];
};

function ApplicationList({ hankeTunnus, applications }: Props) {
  const { t, i18n } = useTranslation();

  const columns: Column<HankkeenHakemus>[] = React.useMemo(() => {
    return [
      {
        id: 'id',
        accessor: 'id',
        defaultCanFilter: true,
      },
      {
        id: 'name',
        accessor: (application) => application.applicationData.name,
        defaultCanFilter: true,
      },
      {
        id: 'alluStatus',
        accessor: 'alluStatus',
        defaultCanFilter: true,
      },
    ];
  }, []);

  const {
    page,
    gotoPage,
    pageCount,
    state: { pageIndex },
    rows,
  } = useTable<HankkeenHakemus>(
    {
      columns,
      data: applications,
      initialState: {
        pageSize: 10,
        sortBy: React.useMemo(() => [{ id: 'id', desc: true }], []),
      },
    },
    useSortBy,
    usePagination,
  );

  if (rows.length === 0) {
    return (
      <Box textAlign="center" mt="var(--spacing-2-xl)">
        <p>{t('hakemus:notifications:noApplications')}</p>
      </Box>
    );
  }

  function handlePageChange(e: React.MouseEvent, index: number) {
    e.preventDefault();
    gotoPage(index);
  }

  return (
    <div>
      {page.map((row) => {
        return (
          <ApplicationListItem
            key={row.original.id}
            hankeTunnus={hankeTunnus}
            application={row.original}
          />
        );
      })}

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
    </div>
  );
}

export default ApplicationList;
