import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, Pagination } from 'hds-react';
import { format } from 'date-fns';
import { useLocalizedRoutes } from '../../../common/hooks/useLocalizedRoutes';
import { HankeDataDraft } from '../../types/hanke';
import HankeVaiheTag from '../vaiheTag/HankeVaiheTag';
import './Hankelista.styles.scss';
import { hankeHasGeometry } from '../../map/utils';

type Props = {
  projectsData: HankeDataDraft[];
};

type sortColKey = 'nimi' | 'vaihe' | 'alkuPvm' | 'loppuPvm';

// Number of items shown on page at once
const PAGE_SIZE = 8;

const HankeList: React.FC<React.PropsWithChildren<Props>> = ({ projectsData }) => {
  const { PUBLIC_HANKKEET_MAP } = useLocalizedRoutes();
  const { t, i18n } = useTranslation();
  const language = i18n.language as 'fi' | 'sv' | 'en';
  const [pageIndex, setPageIndex] = useState(0);
  const [sortedProjects, setSortedProjects] = useState(projectsData.slice());
  const [projectsOnPage, setProjectsOnPage] = useState(projectsData.slice(0, PAGE_SIZE));
  const pageCount = Math.ceil(projectsData.length / PAGE_SIZE);

  function getHankeLink(args: HankeDataDraft) {
    const hasGeometry = hankeHasGeometry(args);
    if (hasGeometry) {
      return (
        <Link to={`${PUBLIC_HANKKEET_MAP.path}?hanke=${args.hankeTunnus}`}>{args.hankeTunnus}</Link>
      );
    }
    return args.hankeTunnus as string;
  }

  function updateProjectsOnPage(projects: HankeDataDraft[], index: number) {
    setProjectsOnPage(projects.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE));
  }

  function handlePageChange(e: React.MouseEvent, index: number) {
    e.preventDefault();
    setPageIndex(index);
    updateProjectsOnPage(sortedProjects, index);
  }

  // Custom sort function for sorting all of the items instead of just
  // the ones displayed
  function sort(order: 'asc' | 'desc', colKey: string, handleSort: () => void) {
    const sortedRows = [...sortedProjects].sort((a, b) => {
      const aValue = a[colKey as sortColKey];
      const bValue = b[colKey as sortColKey];

      if (aValue === undefined) {
        return order === 'asc' ? -1 : 1;
      }
      if (bValue === undefined) {
        return order === 'asc' ? 1 : -1;
      }
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortedProjects(sortedRows);
    updateProjectsOnPage(sortedRows, pageIndex);

    handleSort();
  }

  return (
    <div className="hankelista">
      <div className="hankelista__inner">
        <Table
          cols={[
            {
              headerName: t('hankeList:tableHeader:id'),
              key: 'hankeTunnus',
              transform: getHankeLink,
            },
            {
              headerName: t('hankeList:tableHeader:name'),
              key: 'nimi',
              isSortable: true,
            },
            {
              headerName: t('hankeList:tableHeader:step'),
              key: 'vaihe',
              isSortable: true,
              transform: (args: HankeDataDraft) => <HankeVaiheTag tagName={args.vaihe} uppercase />,
            },
            {
              headerName: t('hankeList:tableHeader:startDate'),
              key: 'alkuPvm',
              transform: (args: HankeDataDraft) =>
                args.alkuPvm ? format(Date.parse(args.alkuPvm), 'dd.MM.yyyy') : '',
              isSortable: true,
              sortIconType: 'other',
            },
            {
              headerName: t('hankeList:tableHeader:endDate'),
              key: 'loppuPvm',
              transform: (args: HankeDataDraft) =>
                args.loppuPvm ? format(Date.parse(args.loppuPvm), 'dd.MM.yyyy') : '',
              isSortable: true,
              sortIconType: 'other',
            },
          ]}
          indexKey="hankeTunnus"
          rows={projectsOnPage}
          variant="light"
          onSort={sort}
        />
      </div>

      <div className="hankelista__pagination">
        <Pagination
          language={language}
          onChange={handlePageChange}
          pageHref={() => ''}
          pageCount={pageCount}
          pageIndex={pageIndex}
          paginationAriaLabel={t('hankeList:paginatioAriaLabel')}
        />
      </div>
    </div>
  );
};

export default HankeList;
