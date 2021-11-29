import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconAngleLeft, IconAngleRight } from 'hds-react/icons';
import styles from './PaginationControl.module.scss';

export interface Props {
  goToPage: (updater: number | ((pageIndex: number) => number)) => void;
  previousPage: () => void;
  nextPage: () => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
  pagesLength: number;
}

const PaginationControl: React.FC<Props> = ({
  goToPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pagesLength,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.toBeginning}
          data-testid="toBeginning"
          onClick={() => goToPage(0)}
          disabled={!canPreviousPage}
          aria-label={t('hankeList:buttons:toFirstPage')}
        >
          <IconAngleLeft aria-hidden="true" />
          <IconAngleLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.backward}
          onClick={() => previousPage()}
          data-testid="backward"
          disabled={!canPreviousPage}
          aria-label={t('hankeList:buttons:toPreviousPage')}
        >
          <IconAngleLeft aria-hidden="true" />
        </button>
        <span className={styles.wrp}>
          {t('hankeList:paginationHeader')} <span data-testid="currentPage">{pageIndex + 1}</span> /{' '}
          <span>{pagesLength}</span>
        </span>
        <button
          type="button"
          className={styles.forward}
          data-testid="forward"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          aria-label={t('hankeList:buttons:toNextPage')}
        >
          <IconAngleRight aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.toEnd}
          data-testid="toEnd"
          onClick={() => goToPage(pageCount - 1)}
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
export default PaginationControl;
