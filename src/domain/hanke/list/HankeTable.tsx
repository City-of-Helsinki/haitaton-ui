import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import { IconAngleUp, IconAngleDown } from 'hds-react/icons';
import PaginationControl from '../../common/pagination/PaginationControl';

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
      initialState: {
        pageSize: 10,
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
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationControl
        goToPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pagesLength={pageOptions.length}
      />
    </>
  );
};
export default Table;
