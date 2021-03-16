import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import {
  IconCrossCircle,
  IconPen,
  IconAngleLeft,
  IconAngleRight,
  IconAngleUp,
  IconAngleDown,
} from 'hds-react/icons';
import useLinkPath from '../../../common/hooks/useLinkPath';
import { ROUTES } from '../../../common/types/route';

function compareIgnoreCase(a: string, b: string) {
  const r1 = a.toString().toLowerCase();
  const r2 = b.toString().toLowerCase();
  if (r1 < r2) {
    return -1;
  }
  if (r1 > r2) {
    return 1;
  }
  return 0;
}

export type HankeListColumn = {
  Header: string;
  // eslint-disable-next-line
  accessor: any;
};

export interface Props {
  columns: Array<HankeListColumn>;
  data: Record<string, unknown>[];
}

const Table: React.FC<Props> = ({ columns, data }) => {
  const { t } = useTranslation();
  const getEditHankePath = useLinkPath(ROUTES.EDIT_HANKE);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          return compareIgnoreCase(row1.values[columnName], row2.values[columnName]);
        },
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th key={column.id}>
                  {column.id !== 'id' ? (
                    <button
                      data-testid={`tableHeaderButton${i}`}
                      type="button"
                      {...column.getSortByToggleProps()}
                      aria-label={t(`hankeList:sortButtons:${column.id}`)}
                    >
                      <div>
                        {column.render('Header')}
                        {column.isSorted &&
                          (column.isSortedDesc ? (
                            <IconAngleUp aria-hidden="true" />
                          ) : (
                            <IconAngleDown aria-hidden="true" />
                          ))}
                        {!column.isSorted && (
                          <>
                            <span className="unSelectedWpr">
                              <span className="unSelected">
                                <IconAngleUp aria-hidden="true" />
                                <IconAngleDown aria-hidden="true" />
                              </span>
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  ) : (
                    column.render('Header')
                  )}
                </th>
              ))}
              <th>
                <div />
              </th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td data-testid={`row${index}_cell_${cell.column.id}`} {...cell.getCellProps()}>
                      <span className={cell.column.id}>
                        {cell.column.id === 'startDate' || cell.column.id === 'endDate'
                          ? format(cell.value, 'dd.MM.yyyy')
                          : cell.render('Cell')}
                      </span>
                    </td>
                  );
                })}
                <td>
                  <Link
                    to={getEditHankePath({ hankeTunnus: row.values.id })}
                    aria-label={
                      // eslint-disable-next-line
                      t(`routes:${ROUTES.EDIT_HANKE}.meta.title`) +
                      ` ${row.values.name} - ${row.values.id} `
                    }
                    data-testid="hankeEditLink"
                  >
                    <IconPen aria-hidden />
                  </Link>
                  <button type="button" disabled aria-label={t('hankeList:buttons:delete')}>
                    <IconCrossCircle className="remove" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          type="button"
          className="toBeginning"
          data-testid="toBeginning"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          aria-label={t('hankeList:buttons:toFirstPage')}
        >
          <IconAngleLeft aria-hidden="true" />
          <IconAngleLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="backward"
          onClick={() => previousPage()}
          data-testid="backward"
          disabled={!canPreviousPage}
          aria-label={t('hankeList:buttons:toPreviousPage')}
        >
          <IconAngleLeft aria-hidden="true" />
        </button>
        <span className="wrp">
          {t('hankeList:paginationHeader')} <span data-testid="currentPage">{pageIndex + 1}</span> /{' '}
          <span data-testid="amountOfpages">{pageOptions.length}</span>
        </span>
        <button
          type="button"
          className="forward"
          data-testid="forward"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          aria-label={t('hankeList:buttons:toNextPage')}
        >
          <IconAngleRight aria-hidden="true" />
        </button>
        <button
          type="button"
          className="toEnd"
          data-testid="toEnd"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          aria-label={t('hankeList:buttons:toLastPage')}
        >
          <IconAngleRight aria-hidden="true" />
          <IconAngleRight aria-hidden="true" />
        </button>
      </div>
    </>
  );
};
export default Table;
