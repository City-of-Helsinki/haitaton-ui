import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';
import format from 'date-fns/format';
import {
  IconAngleDown,
  IconAngleUp,
  IconCrossCircle,
  IconPen,
  IconAngleLeft,
  IconAngleRight,
} from 'hds-react/icons';
import { TableProps } from './types';

const Table: React.FC<TableProps> = ({ columns, data }) => {
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
  const { t } = useTranslation();

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  data-testid={`tableHeader${i}`}
                >
                  <div>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    {column.isSorted && (column.isSortedDesc ? <IconAngleUp /> : <IconAngleDown />)}
                    {!column.isSorted && (
                      <>
                        <span className="unSelectedWpr">
                          <span className="unSelected">
                            <IconAngleUp />
                            <IconAngleDown />
                          </span>
                        </span>
                      </>
                    )}
                  </div>
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
                  <span>
                    <IconPen className="pen" />
                    <IconCrossCircle className="remove" />
                  </span>
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
        >
          <IconAngleLeft />
          <IconAngleLeft />
        </button>
        <button
          type="button"
          className="backward"
          onClick={() => previousPage()}
          data-testid="backward"
          disabled={!canPreviousPage}
        >
          <IconAngleLeft />
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
        >
          <IconAngleRight />
        </button>
        <button
          type="button"
          className="toEnd"
          data-testid="toEnd"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <IconAngleRight />
          <IconAngleRight />
        </button>
      </div>
    </>
  );
};
export default Table;
