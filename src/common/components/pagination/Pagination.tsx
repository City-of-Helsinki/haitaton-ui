import { Pagination as HDSPagination, PaginationProps } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Language } from '../../types/language';
import styles from './Pagination.module.scss';
import clsx from 'clsx';

/**
 * A wrapper for the HDS Pagination component.
 * It uses custom styles for 'span.item-link' width to fix a layout issue
 * and uses the `useTranslation` hook to set the language dynamically
 * based on the current i18n context.
 */
export default function Pagination({ className, ...rest }: Readonly<PaginationProps>) {
  const { i18n } = useTranslation();
  return (
    <HDSPagination
      className={clsx(className, styles.pagination)}
      language={i18n.language as Language}
      {...rest}
    />
  );
}
