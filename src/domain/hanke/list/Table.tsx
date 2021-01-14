import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useTranslation } from 'react-i18next';
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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
    },
    useSortBy,
    usePagination
  );
  const { t } = useTranslation();
  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case

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
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
                <td>
                  <IconPen className="pen" />
                  <IconCrossCircle className="remove" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          type="button"
          className="toBegining"
          data-testid="toBegining"
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
